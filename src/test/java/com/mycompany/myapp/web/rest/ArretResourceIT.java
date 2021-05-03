package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Arret;
import com.mycompany.myapp.repository.ArretRepository;
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
 * Integration tests for the {@link ArretResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArretResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/arrets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ArretRepository arretRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArretMockMvc;

    private Arret arret;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Arret createEntity(EntityManager em) {
        Arret arret = new Arret().description(DEFAULT_DESCRIPTION);
        return arret;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Arret createUpdatedEntity(EntityManager em) {
        Arret arret = new Arret().description(UPDATED_DESCRIPTION);
        return arret;
    }

    @BeforeEach
    public void initTest() {
        arret = createEntity(em);
    }

    @Test
    @Transactional
    void createArret() throws Exception {
        int databaseSizeBeforeCreate = arretRepository.findAll().size();
        // Create the Arret
        restArretMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(arret)))
            .andExpect(status().isCreated());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeCreate + 1);
        Arret testArret = arretList.get(arretList.size() - 1);
        assertThat(testArret.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createArretWithExistingId() throws Exception {
        // Create the Arret with an existing ID
        arret.setId(1L);

        int databaseSizeBeforeCreate = arretRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArretMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(arret)))
            .andExpect(status().isBadRequest());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllArrets() throws Exception {
        // Initialize the database
        arretRepository.saveAndFlush(arret);

        // Get all the arretList
        restArretMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(arret.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getArret() throws Exception {
        // Initialize the database
        arretRepository.saveAndFlush(arret);

        // Get the arret
        restArretMockMvc
            .perform(get(ENTITY_API_URL_ID, arret.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(arret.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingArret() throws Exception {
        // Get the arret
        restArretMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewArret() throws Exception {
        // Initialize the database
        arretRepository.saveAndFlush(arret);

        int databaseSizeBeforeUpdate = arretRepository.findAll().size();

        // Update the arret
        Arret updatedArret = arretRepository.findById(arret.getId()).get();
        // Disconnect from session so that the updates on updatedArret are not directly saved in db
        em.detach(updatedArret);
        updatedArret.description(UPDATED_DESCRIPTION);

        restArretMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArret.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedArret))
            )
            .andExpect(status().isOk());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
        Arret testArret = arretList.get(arretList.size() - 1);
        assertThat(testArret.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingArret() throws Exception {
        int databaseSizeBeforeUpdate = arretRepository.findAll().size();
        arret.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArretMockMvc
            .perform(
                put(ENTITY_API_URL_ID, arret.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(arret))
            )
            .andExpect(status().isBadRequest());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArret() throws Exception {
        int databaseSizeBeforeUpdate = arretRepository.findAll().size();
        arret.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArretMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(arret))
            )
            .andExpect(status().isBadRequest());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArret() throws Exception {
        int databaseSizeBeforeUpdate = arretRepository.findAll().size();
        arret.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArretMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(arret)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArretWithPatch() throws Exception {
        // Initialize the database
        arretRepository.saveAndFlush(arret);

        int databaseSizeBeforeUpdate = arretRepository.findAll().size();

        // Update the arret using partial update
        Arret partialUpdatedArret = new Arret();
        partialUpdatedArret.setId(arret.getId());

        restArretMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArret.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArret))
            )
            .andExpect(status().isOk());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
        Arret testArret = arretList.get(arretList.size() - 1);
        assertThat(testArret.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateArretWithPatch() throws Exception {
        // Initialize the database
        arretRepository.saveAndFlush(arret);

        int databaseSizeBeforeUpdate = arretRepository.findAll().size();

        // Update the arret using partial update
        Arret partialUpdatedArret = new Arret();
        partialUpdatedArret.setId(arret.getId());

        partialUpdatedArret.description(UPDATED_DESCRIPTION);

        restArretMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArret.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArret))
            )
            .andExpect(status().isOk());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
        Arret testArret = arretList.get(arretList.size() - 1);
        assertThat(testArret.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingArret() throws Exception {
        int databaseSizeBeforeUpdate = arretRepository.findAll().size();
        arret.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArretMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, arret.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(arret))
            )
            .andExpect(status().isBadRequest());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArret() throws Exception {
        int databaseSizeBeforeUpdate = arretRepository.findAll().size();
        arret.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArretMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(arret))
            )
            .andExpect(status().isBadRequest());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArret() throws Exception {
        int databaseSizeBeforeUpdate = arretRepository.findAll().size();
        arret.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArretMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(arret)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Arret in the database
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArret() throws Exception {
        // Initialize the database
        arretRepository.saveAndFlush(arret);

        int databaseSizeBeforeDelete = arretRepository.findAll().size();

        // Delete the arret
        restArretMockMvc
            .perform(delete(ENTITY_API_URL_ID, arret.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Arret> arretList = arretRepository.findAll();
        assertThat(arretList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
