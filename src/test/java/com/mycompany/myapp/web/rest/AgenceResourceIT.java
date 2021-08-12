package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Agence;
import com.mycompany.myapp.repository.AgenceRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AgenceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AgenceResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_RESPONSABLE = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSABLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/agences";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgenceRepository agenceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgenceMockMvc;

    private Agence agence;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Agence createEntity(EntityManager em) {
        Agence agence = new Agence().nom(DEFAULT_NOM).telephone(DEFAULT_TELEPHONE).responsable(DEFAULT_RESPONSABLE);
        return agence;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Agence createUpdatedEntity(EntityManager em) {
        Agence agence = new Agence().nom(UPDATED_NOM).telephone(UPDATED_TELEPHONE).responsable(UPDATED_RESPONSABLE);
        return agence;
    }

    @BeforeEach
    public void initTest() {
        agence = createEntity(em);
    }

    @Test
    @Transactional
    void createAgence() throws Exception {
        int databaseSizeBeforeCreate = agenceRepository.findAll().size();
        // Create the Agence
        restAgenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agence)))
            .andExpect(status().isCreated());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeCreate + 1);
        Agence testAgence = agenceList.get(agenceList.size() - 1);
        assertThat(testAgence.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAgence.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testAgence.getResponsable()).isEqualTo(DEFAULT_RESPONSABLE);
    }

    @Test
    @Transactional
    void createAgenceWithExistingId() throws Exception {
        // Create the Agence with an existing ID
        agence.setId(1L);

        int databaseSizeBeforeCreate = agenceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agence)))
            .andExpect(status().isBadRequest());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTelephoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = agenceRepository.findAll().size();
        // set the field null
        agence.setTelephone(null);

        // Create the Agence, which fails.

        restAgenceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agence)))
            .andExpect(status().isBadRequest());

        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAgences() throws Exception {
        // Initialize the database
        agenceRepository.saveAndFlush(agence);

        // Get all the agenceList
        restAgenceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agence.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].responsable").value(hasItem(DEFAULT_RESPONSABLE)));
    }

    @Test
    @Transactional
    void getAgence() throws Exception {
        // Initialize the database
        agenceRepository.saveAndFlush(agence);

        // Get the agence
        restAgenceMockMvc
            .perform(get(ENTITY_API_URL_ID, agence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agence.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.responsable").value(DEFAULT_RESPONSABLE));
    }

    @Test
    @Transactional
    void getNonExistingAgence() throws Exception {
        // Get the agence
        restAgenceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAgence() throws Exception {
        // Initialize the database
        agenceRepository.saveAndFlush(agence);

        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();

        // Update the agence
        Agence updatedAgence = agenceRepository.findById(agence.getId()).get();
        // Disconnect from session so that the updates on updatedAgence are not directly saved in db
        em.detach(updatedAgence);
        updatedAgence.nom(UPDATED_NOM).telephone(UPDATED_TELEPHONE).responsable(UPDATED_RESPONSABLE);

        restAgenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAgence.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAgence))
            )
            .andExpect(status().isOk());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
        Agence testAgence = agenceList.get(agenceList.size() - 1);
        assertThat(testAgence.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAgence.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testAgence.getResponsable()).isEqualTo(UPDATED_RESPONSABLE);
    }

    @Test
    @Transactional
    void putNonExistingAgence() throws Exception {
        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();
        agence.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agence.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgence() throws Exception {
        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();
        agence.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgenceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgence() throws Exception {
        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();
        agence.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgenceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agence)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgenceWithPatch() throws Exception {
        // Initialize the database
        agenceRepository.saveAndFlush(agence);

        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();

        // Update the agence using partial update
        Agence partialUpdatedAgence = new Agence();
        partialUpdatedAgence.setId(agence.getId());

        restAgenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgence.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgence))
            )
            .andExpect(status().isOk());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
        Agence testAgence = agenceList.get(agenceList.size() - 1);
        assertThat(testAgence.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testAgence.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testAgence.getResponsable()).isEqualTo(DEFAULT_RESPONSABLE);
    }

    @Test
    @Transactional
    void fullUpdateAgenceWithPatch() throws Exception {
        // Initialize the database
        agenceRepository.saveAndFlush(agence);

        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();

        // Update the agence using partial update
        Agence partialUpdatedAgence = new Agence();
        partialUpdatedAgence.setId(agence.getId());

        partialUpdatedAgence.nom(UPDATED_NOM).telephone(UPDATED_TELEPHONE).responsable(UPDATED_RESPONSABLE);

        restAgenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgence.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgence))
            )
            .andExpect(status().isOk());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
        Agence testAgence = agenceList.get(agenceList.size() - 1);
        assertThat(testAgence.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testAgence.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testAgence.getResponsable()).isEqualTo(UPDATED_RESPONSABLE);
    }

    @Test
    @Transactional
    void patchNonExistingAgence() throws Exception {
        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();
        agence.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agence.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgence() throws Exception {
        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();
        agence.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgenceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agence))
            )
            .andExpect(status().isBadRequest());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgence() throws Exception {
        int databaseSizeBeforeUpdate = agenceRepository.findAll().size();
        agence.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgenceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(agence)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Agence in the database
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgence() throws Exception {
        // Initialize the database
        agenceRepository.saveAndFlush(agence);

        int databaseSizeBeforeDelete = agenceRepository.findAll().size();

        // Delete the agence
        restAgenceMockMvc
            .perform(delete(ENTITY_API_URL_ID, agence.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Agence> agenceList = agenceRepository.findAll();
        assertThat(agenceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
