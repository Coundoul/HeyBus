package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Revenu;
import com.mycompany.myapp.repository.RevenuRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link RevenuResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RevenuResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Double DEFAULT_MONTANT = 1D;
    private static final Double UPDATED_MONTANT = 2D;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/revenus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RevenuRepository revenuRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRevenuMockMvc;

    private Revenu revenu;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Revenu createEntity(EntityManager em) {
        Revenu revenu = new Revenu().date(DEFAULT_DATE).type(DEFAULT_TYPE).montant(DEFAULT_MONTANT).description(DEFAULT_DESCRIPTION);
        return revenu;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Revenu createUpdatedEntity(EntityManager em) {
        Revenu revenu = new Revenu().date(UPDATED_DATE).type(UPDATED_TYPE).montant(UPDATED_MONTANT).description(UPDATED_DESCRIPTION);
        return revenu;
    }

    @BeforeEach
    public void initTest() {
        revenu = createEntity(em);
    }

    @Test
    @Transactional
    void createRevenu() throws Exception {
        int databaseSizeBeforeCreate = revenuRepository.findAll().size();
        // Create the Revenu
        restRevenuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isCreated());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeCreate + 1);
        Revenu testRevenu = revenuList.get(revenuList.size() - 1);
        assertThat(testRevenu.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testRevenu.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testRevenu.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testRevenu.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createRevenuWithExistingId() throws Exception {
        // Create the Revenu with an existing ID
        revenu.setId(1L);

        int databaseSizeBeforeCreate = revenuRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRevenuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isBadRequest());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = revenuRepository.findAll().size();
        // set the field null
        revenu.setDate(null);

        // Create the Revenu, which fails.

        restRevenuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isBadRequest());

        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = revenuRepository.findAll().size();
        // set the field null
        revenu.setType(null);

        // Create the Revenu, which fails.

        restRevenuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isBadRequest());

        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMontantIsRequired() throws Exception {
        int databaseSizeBeforeTest = revenuRepository.findAll().size();
        // set the field null
        revenu.setMontant(null);

        // Create the Revenu, which fails.

        restRevenuMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isBadRequest());

        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRevenus() throws Exception {
        // Initialize the database
        revenuRepository.saveAndFlush(revenu);

        // Get all the revenuList
        restRevenuMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(revenu.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getRevenu() throws Exception {
        // Initialize the database
        revenuRepository.saveAndFlush(revenu);

        // Get the revenu
        restRevenuMockMvc
            .perform(get(ENTITY_API_URL_ID, revenu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(revenu.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.montant").value(DEFAULT_MONTANT.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingRevenu() throws Exception {
        // Get the revenu
        restRevenuMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRevenu() throws Exception {
        // Initialize the database
        revenuRepository.saveAndFlush(revenu);

        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();

        // Update the revenu
        Revenu updatedRevenu = revenuRepository.findById(revenu.getId()).get();
        // Disconnect from session so that the updates on updatedRevenu are not directly saved in db
        em.detach(updatedRevenu);
        updatedRevenu.date(UPDATED_DATE).type(UPDATED_TYPE).montant(UPDATED_MONTANT).description(UPDATED_DESCRIPTION);

        restRevenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRevenu.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRevenu))
            )
            .andExpect(status().isOk());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
        Revenu testRevenu = revenuList.get(revenuList.size() - 1);
        assertThat(testRevenu.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRevenu.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testRevenu.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testRevenu.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingRevenu() throws Exception {
        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();
        revenu.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRevenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, revenu.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(revenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRevenu() throws Exception {
        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();
        revenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRevenuMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(revenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRevenu() throws Exception {
        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();
        revenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRevenuMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRevenuWithPatch() throws Exception {
        // Initialize the database
        revenuRepository.saveAndFlush(revenu);

        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();

        // Update the revenu using partial update
        Revenu partialUpdatedRevenu = new Revenu();
        partialUpdatedRevenu.setId(revenu.getId());

        partialUpdatedRevenu.type(UPDATED_TYPE);

        restRevenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRevenu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRevenu))
            )
            .andExpect(status().isOk());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
        Revenu testRevenu = revenuList.get(revenuList.size() - 1);
        assertThat(testRevenu.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testRevenu.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testRevenu.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testRevenu.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateRevenuWithPatch() throws Exception {
        // Initialize the database
        revenuRepository.saveAndFlush(revenu);

        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();

        // Update the revenu using partial update
        Revenu partialUpdatedRevenu = new Revenu();
        partialUpdatedRevenu.setId(revenu.getId());

        partialUpdatedRevenu.date(UPDATED_DATE).type(UPDATED_TYPE).montant(UPDATED_MONTANT).description(UPDATED_DESCRIPTION);

        restRevenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRevenu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRevenu))
            )
            .andExpect(status().isOk());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
        Revenu testRevenu = revenuList.get(revenuList.size() - 1);
        assertThat(testRevenu.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRevenu.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testRevenu.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testRevenu.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingRevenu() throws Exception {
        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();
        revenu.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRevenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, revenu.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(revenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRevenu() throws Exception {
        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();
        revenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRevenuMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(revenu))
            )
            .andExpect(status().isBadRequest());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRevenu() throws Exception {
        int databaseSizeBeforeUpdate = revenuRepository.findAll().size();
        revenu.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRevenuMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(revenu)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Revenu in the database
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRevenu() throws Exception {
        // Initialize the database
        revenuRepository.saveAndFlush(revenu);

        int databaseSizeBeforeDelete = revenuRepository.findAll().size();

        // Delete the revenu
        restRevenuMockMvc
            .perform(delete(ENTITY_API_URL_ID, revenu.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Revenu> revenuList = revenuRepository.findAll();
        assertThat(revenuList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
