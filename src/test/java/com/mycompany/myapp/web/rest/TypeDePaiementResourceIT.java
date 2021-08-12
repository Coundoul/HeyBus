package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TypeDePaiement;
import com.mycompany.myapp.repository.TypeDePaiementRepository;
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
 * Integration tests for the {@link TypeDePaiementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeDePaiementResourceIT {

    private static final String DEFAULT_PAIEMENT = "AAAAAAAAAA";
    private static final String UPDATED_PAIEMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-de-paiements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeDePaiementRepository typeDePaiementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeDePaiementMockMvc;

    private TypeDePaiement typeDePaiement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeDePaiement createEntity(EntityManager em) {
        TypeDePaiement typeDePaiement = new TypeDePaiement().paiement(DEFAULT_PAIEMENT);
        return typeDePaiement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeDePaiement createUpdatedEntity(EntityManager em) {
        TypeDePaiement typeDePaiement = new TypeDePaiement().paiement(UPDATED_PAIEMENT);
        return typeDePaiement;
    }

    @BeforeEach
    public void initTest() {
        typeDePaiement = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeDePaiement() throws Exception {
        int databaseSizeBeforeCreate = typeDePaiementRepository.findAll().size();
        // Create the TypeDePaiement
        restTypeDePaiementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isCreated());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeCreate + 1);
        TypeDePaiement testTypeDePaiement = typeDePaiementList.get(typeDePaiementList.size() - 1);
        assertThat(testTypeDePaiement.getPaiement()).isEqualTo(DEFAULT_PAIEMENT);
    }

    @Test
    @Transactional
    void createTypeDePaiementWithExistingId() throws Exception {
        // Create the TypeDePaiement with an existing ID
        typeDePaiement.setId(1L);

        int databaseSizeBeforeCreate = typeDePaiementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeDePaiementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPaiementIsRequired() throws Exception {
        int databaseSizeBeforeTest = typeDePaiementRepository.findAll().size();
        // set the field null
        typeDePaiement.setPaiement(null);

        // Create the TypeDePaiement, which fails.

        restTypeDePaiementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isBadRequest());

        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTypeDePaiements() throws Exception {
        // Initialize the database
        typeDePaiementRepository.saveAndFlush(typeDePaiement);

        // Get all the typeDePaiementList
        restTypeDePaiementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeDePaiement.getId().intValue())))
            .andExpect(jsonPath("$.[*].paiement").value(hasItem(DEFAULT_PAIEMENT)));
    }

    @Test
    @Transactional
    void getTypeDePaiement() throws Exception {
        // Initialize the database
        typeDePaiementRepository.saveAndFlush(typeDePaiement);

        // Get the typeDePaiement
        restTypeDePaiementMockMvc
            .perform(get(ENTITY_API_URL_ID, typeDePaiement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeDePaiement.getId().intValue()))
            .andExpect(jsonPath("$.paiement").value(DEFAULT_PAIEMENT));
    }

    @Test
    @Transactional
    void getNonExistingTypeDePaiement() throws Exception {
        // Get the typeDePaiement
        restTypeDePaiementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTypeDePaiement() throws Exception {
        // Initialize the database
        typeDePaiementRepository.saveAndFlush(typeDePaiement);

        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();

        // Update the typeDePaiement
        TypeDePaiement updatedTypeDePaiement = typeDePaiementRepository.findById(typeDePaiement.getId()).get();
        // Disconnect from session so that the updates on updatedTypeDePaiement are not directly saved in db
        em.detach(updatedTypeDePaiement);
        updatedTypeDePaiement.paiement(UPDATED_PAIEMENT);

        restTypeDePaiementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeDePaiement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeDePaiement))
            )
            .andExpect(status().isOk());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
        TypeDePaiement testTypeDePaiement = typeDePaiementList.get(typeDePaiementList.size() - 1);
        assertThat(testTypeDePaiement.getPaiement()).isEqualTo(UPDATED_PAIEMENT);
    }

    @Test
    @Transactional
    void putNonExistingTypeDePaiement() throws Exception {
        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();
        typeDePaiement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeDePaiementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeDePaiement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeDePaiement() throws Exception {
        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();
        typeDePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDePaiementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeDePaiement() throws Exception {
        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();
        typeDePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDePaiementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDePaiement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeDePaiementWithPatch() throws Exception {
        // Initialize the database
        typeDePaiementRepository.saveAndFlush(typeDePaiement);

        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();

        // Update the typeDePaiement using partial update
        TypeDePaiement partialUpdatedTypeDePaiement = new TypeDePaiement();
        partialUpdatedTypeDePaiement.setId(typeDePaiement.getId());

        partialUpdatedTypeDePaiement.paiement(UPDATED_PAIEMENT);

        restTypeDePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeDePaiement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeDePaiement))
            )
            .andExpect(status().isOk());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
        TypeDePaiement testTypeDePaiement = typeDePaiementList.get(typeDePaiementList.size() - 1);
        assertThat(testTypeDePaiement.getPaiement()).isEqualTo(UPDATED_PAIEMENT);
    }

    @Test
    @Transactional
    void fullUpdateTypeDePaiementWithPatch() throws Exception {
        // Initialize the database
        typeDePaiementRepository.saveAndFlush(typeDePaiement);

        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();

        // Update the typeDePaiement using partial update
        TypeDePaiement partialUpdatedTypeDePaiement = new TypeDePaiement();
        partialUpdatedTypeDePaiement.setId(typeDePaiement.getId());

        partialUpdatedTypeDePaiement.paiement(UPDATED_PAIEMENT);

        restTypeDePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeDePaiement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeDePaiement))
            )
            .andExpect(status().isOk());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
        TypeDePaiement testTypeDePaiement = typeDePaiementList.get(typeDePaiementList.size() - 1);
        assertThat(testTypeDePaiement.getPaiement()).isEqualTo(UPDATED_PAIEMENT);
    }

    @Test
    @Transactional
    void patchNonExistingTypeDePaiement() throws Exception {
        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();
        typeDePaiement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeDePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeDePaiement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeDePaiement() throws Exception {
        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();
        typeDePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeDePaiement() throws Exception {
        int databaseSizeBeforeUpdate = typeDePaiementRepository.findAll().size();
        typeDePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeDePaiement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeDePaiement in the database
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeDePaiement() throws Exception {
        // Initialize the database
        typeDePaiementRepository.saveAndFlush(typeDePaiement);

        int databaseSizeBeforeDelete = typeDePaiementRepository.findAll().size();

        // Delete the typeDePaiement
        restTypeDePaiementMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeDePaiement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeDePaiement> typeDePaiementList = typeDePaiementRepository.findAll();
        assertThat(typeDePaiementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
