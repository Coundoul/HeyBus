package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Incident;
import com.mycompany.myapp.repository.IncidentRepository;
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
 * Integration tests for the {@link IncidentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IncidentResourceIT {

    private static final String DEFAULT_GRAVITE = "AAAAAAAAAA";
    private static final String UPDATED_GRAVITE = "BBBBBBBBBB";

    private static final String DEFAULT_CHAUFFEUR = "AAAAAAAAAA";
    private static final String UPDATED_CHAUFFEUR = "BBBBBBBBBB";

    private static final String DEFAULT_RESPONSABLEINCIDENT = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSABLEINCIDENT = "BBBBBBBBBB";

    private static final String DEFAULT_REPORTEURINCIDENT = "AAAAAAAAAA";
    private static final String UPDATED_REPORTEURINCIDENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/incidents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIncidentMockMvc;

    private Incident incident;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Incident createEntity(EntityManager em) {
        Incident incident = new Incident()
            .gravite(DEFAULT_GRAVITE)
            .chauffeur(DEFAULT_CHAUFFEUR)
            .responsableincident(DEFAULT_RESPONSABLEINCIDENT)
            .reporteurincident(DEFAULT_REPORTEURINCIDENT);
        return incident;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Incident createUpdatedEntity(EntityManager em) {
        Incident incident = new Incident()
            .gravite(UPDATED_GRAVITE)
            .chauffeur(UPDATED_CHAUFFEUR)
            .responsableincident(UPDATED_RESPONSABLEINCIDENT)
            .reporteurincident(UPDATED_REPORTEURINCIDENT);
        return incident;
    }

    @BeforeEach
    public void initTest() {
        incident = createEntity(em);
    }

    @Test
    @Transactional
    void createIncident() throws Exception {
        int databaseSizeBeforeCreate = incidentRepository.findAll().size();
        // Create the Incident
        restIncidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incident)))
            .andExpect(status().isCreated());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeCreate + 1);
        Incident testIncident = incidentList.get(incidentList.size() - 1);
        assertThat(testIncident.getGravite()).isEqualTo(DEFAULT_GRAVITE);
        assertThat(testIncident.getChauffeur()).isEqualTo(DEFAULT_CHAUFFEUR);
        assertThat(testIncident.getResponsableincident()).isEqualTo(DEFAULT_RESPONSABLEINCIDENT);
        assertThat(testIncident.getReporteurincident()).isEqualTo(DEFAULT_REPORTEURINCIDENT);
    }

    @Test
    @Transactional
    void createIncidentWithExistingId() throws Exception {
        // Create the Incident with an existing ID
        incident.setId(1L);

        int databaseSizeBeforeCreate = incidentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIncidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incident)))
            .andExpect(status().isBadRequest());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkChauffeurIsRequired() throws Exception {
        int databaseSizeBeforeTest = incidentRepository.findAll().size();
        // set the field null
        incident.setChauffeur(null);

        // Create the Incident, which fails.

        restIncidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incident)))
            .andExpect(status().isBadRequest());

        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkResponsableincidentIsRequired() throws Exception {
        int databaseSizeBeforeTest = incidentRepository.findAll().size();
        // set the field null
        incident.setResponsableincident(null);

        // Create the Incident, which fails.

        restIncidentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incident)))
            .andExpect(status().isBadRequest());

        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIncidents() throws Exception {
        // Initialize the database
        incidentRepository.saveAndFlush(incident);

        // Get all the incidentList
        restIncidentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(incident.getId().intValue())))
            .andExpect(jsonPath("$.[*].gravite").value(hasItem(DEFAULT_GRAVITE)))
            .andExpect(jsonPath("$.[*].chauffeur").value(hasItem(DEFAULT_CHAUFFEUR)))
            .andExpect(jsonPath("$.[*].responsableincident").value(hasItem(DEFAULT_RESPONSABLEINCIDENT)))
            .andExpect(jsonPath("$.[*].reporteurincident").value(hasItem(DEFAULT_REPORTEURINCIDENT)));
    }

    @Test
    @Transactional
    void getIncident() throws Exception {
        // Initialize the database
        incidentRepository.saveAndFlush(incident);

        // Get the incident
        restIncidentMockMvc
            .perform(get(ENTITY_API_URL_ID, incident.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(incident.getId().intValue()))
            .andExpect(jsonPath("$.gravite").value(DEFAULT_GRAVITE))
            .andExpect(jsonPath("$.chauffeur").value(DEFAULT_CHAUFFEUR))
            .andExpect(jsonPath("$.responsableincident").value(DEFAULT_RESPONSABLEINCIDENT))
            .andExpect(jsonPath("$.reporteurincident").value(DEFAULT_REPORTEURINCIDENT));
    }

    @Test
    @Transactional
    void getNonExistingIncident() throws Exception {
        // Get the incident
        restIncidentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIncident() throws Exception {
        // Initialize the database
        incidentRepository.saveAndFlush(incident);

        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();

        // Update the incident
        Incident updatedIncident = incidentRepository.findById(incident.getId()).get();
        // Disconnect from session so that the updates on updatedIncident are not directly saved in db
        em.detach(updatedIncident);
        updatedIncident
            .gravite(UPDATED_GRAVITE)
            .chauffeur(UPDATED_CHAUFFEUR)
            .responsableincident(UPDATED_RESPONSABLEINCIDENT)
            .reporteurincident(UPDATED_REPORTEURINCIDENT);

        restIncidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIncident.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIncident))
            )
            .andExpect(status().isOk());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
        Incident testIncident = incidentList.get(incidentList.size() - 1);
        assertThat(testIncident.getGravite()).isEqualTo(UPDATED_GRAVITE);
        assertThat(testIncident.getChauffeur()).isEqualTo(UPDATED_CHAUFFEUR);
        assertThat(testIncident.getResponsableincident()).isEqualTo(UPDATED_RESPONSABLEINCIDENT);
        assertThat(testIncident.getReporteurincident()).isEqualTo(UPDATED_REPORTEURINCIDENT);
    }

    @Test
    @Transactional
    void putNonExistingIncident() throws Exception {
        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();
        incident.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, incident.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(incident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIncident() throws Exception {
        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();
        incident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncidentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(incident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIncident() throws Exception {
        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();
        incident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncidentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(incident)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIncidentWithPatch() throws Exception {
        // Initialize the database
        incidentRepository.saveAndFlush(incident);

        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();

        // Update the incident using partial update
        Incident partialUpdatedIncident = new Incident();
        partialUpdatedIncident.setId(incident.getId());

        partialUpdatedIncident.chauffeur(UPDATED_CHAUFFEUR);

        restIncidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncident.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIncident))
            )
            .andExpect(status().isOk());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
        Incident testIncident = incidentList.get(incidentList.size() - 1);
        assertThat(testIncident.getGravite()).isEqualTo(DEFAULT_GRAVITE);
        assertThat(testIncident.getChauffeur()).isEqualTo(UPDATED_CHAUFFEUR);
        assertThat(testIncident.getResponsableincident()).isEqualTo(DEFAULT_RESPONSABLEINCIDENT);
        assertThat(testIncident.getReporteurincident()).isEqualTo(DEFAULT_REPORTEURINCIDENT);
    }

    @Test
    @Transactional
    void fullUpdateIncidentWithPatch() throws Exception {
        // Initialize the database
        incidentRepository.saveAndFlush(incident);

        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();

        // Update the incident using partial update
        Incident partialUpdatedIncident = new Incident();
        partialUpdatedIncident.setId(incident.getId());

        partialUpdatedIncident
            .gravite(UPDATED_GRAVITE)
            .chauffeur(UPDATED_CHAUFFEUR)
            .responsableincident(UPDATED_RESPONSABLEINCIDENT)
            .reporteurincident(UPDATED_REPORTEURINCIDENT);

        restIncidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIncident.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIncident))
            )
            .andExpect(status().isOk());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
        Incident testIncident = incidentList.get(incidentList.size() - 1);
        assertThat(testIncident.getGravite()).isEqualTo(UPDATED_GRAVITE);
        assertThat(testIncident.getChauffeur()).isEqualTo(UPDATED_CHAUFFEUR);
        assertThat(testIncident.getResponsableincident()).isEqualTo(UPDATED_RESPONSABLEINCIDENT);
        assertThat(testIncident.getReporteurincident()).isEqualTo(UPDATED_REPORTEURINCIDENT);
    }

    @Test
    @Transactional
    void patchNonExistingIncident() throws Exception {
        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();
        incident.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, incident.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(incident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIncident() throws Exception {
        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();
        incident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncidentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(incident))
            )
            .andExpect(status().isBadRequest());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIncident() throws Exception {
        int databaseSizeBeforeUpdate = incidentRepository.findAll().size();
        incident.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIncidentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(incident)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Incident in the database
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIncident() throws Exception {
        // Initialize the database
        incidentRepository.saveAndFlush(incident);

        int databaseSizeBeforeDelete = incidentRepository.findAll().size();

        // Delete the incident
        restIncidentMockMvc
            .perform(delete(ENTITY_API_URL_ID, incident.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Incident> incidentList = incidentRepository.findAll();
        assertThat(incidentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
