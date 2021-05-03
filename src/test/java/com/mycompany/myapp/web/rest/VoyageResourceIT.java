package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Voyage;
import com.mycompany.myapp.repository.VoyageRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VoyageResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VoyageResourceIT {

    private static final ZonedDateTime DEFAULT_DATE_DE_VOYAGE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_DE_VOYAGE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_PRIX = 1;
    private static final Integer UPDATED_PRIX = 2;

    private static final Integer DEFAULT_NBRE_PLACE = 1;
    private static final Integer UPDATED_NBRE_PLACE = 2;

    private static final String DEFAULT_QUARTIER = "AAAAAAAAAA";
    private static final String UPDATED_QUARTIER = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_CLIMATISATION = false;
    private static final Boolean UPDATED_CLIMATISATION = true;

    private static final Boolean DEFAULT_WIFI = false;
    private static final Boolean UPDATED_WIFI = true;

    private static final Boolean DEFAULT_TOILETTE = false;
    private static final Boolean UPDATED_TOILETTE = true;

    private static final String ENTITY_API_URL = "/api/voyages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoyageRepository voyageRepository;

    @Mock
    private VoyageRepository voyageRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoyageMockMvc;

    private Voyage voyage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Voyage createEntity(EntityManager em) {
        Voyage voyage = new Voyage()
            .dateDeVoyage(DEFAULT_DATE_DE_VOYAGE)
            .prix(DEFAULT_PRIX)
            .nbrePlace(DEFAULT_NBRE_PLACE)
            .quartier(DEFAULT_QUARTIER)
            .description(DEFAULT_DESCRIPTION)
            .climatisation(DEFAULT_CLIMATISATION)
            .wifi(DEFAULT_WIFI)
            .toilette(DEFAULT_TOILETTE);
        return voyage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Voyage createUpdatedEntity(EntityManager em) {
        Voyage voyage = new Voyage()
            .dateDeVoyage(UPDATED_DATE_DE_VOYAGE)
            .prix(UPDATED_PRIX)
            .nbrePlace(UPDATED_NBRE_PLACE)
            .quartier(UPDATED_QUARTIER)
            .description(UPDATED_DESCRIPTION)
            .climatisation(UPDATED_CLIMATISATION)
            .wifi(UPDATED_WIFI)
            .toilette(UPDATED_TOILETTE);
        return voyage;
    }

    @BeforeEach
    public void initTest() {
        voyage = createEntity(em);
    }

    @Test
    @Transactional
    void createVoyage() throws Exception {
        int databaseSizeBeforeCreate = voyageRepository.findAll().size();
        // Create the Voyage
        restVoyageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyage)))
            .andExpect(status().isCreated());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeCreate + 1);
        Voyage testVoyage = voyageList.get(voyageList.size() - 1);
        assertThat(testVoyage.getDateDeVoyage()).isEqualTo(DEFAULT_DATE_DE_VOYAGE);
        assertThat(testVoyage.getPrix()).isEqualTo(DEFAULT_PRIX);
        assertThat(testVoyage.getNbrePlace()).isEqualTo(DEFAULT_NBRE_PLACE);
        assertThat(testVoyage.getQuartier()).isEqualTo(DEFAULT_QUARTIER);
        assertThat(testVoyage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVoyage.getClimatisation()).isEqualTo(DEFAULT_CLIMATISATION);
        assertThat(testVoyage.getWifi()).isEqualTo(DEFAULT_WIFI);
        assertThat(testVoyage.getToilette()).isEqualTo(DEFAULT_TOILETTE);
    }

    @Test
    @Transactional
    void createVoyageWithExistingId() throws Exception {
        // Create the Voyage with an existing ID
        voyage.setId(1L);

        int databaseSizeBeforeCreate = voyageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoyageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyage)))
            .andExpect(status().isBadRequest());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateDeVoyageIsRequired() throws Exception {
        int databaseSizeBeforeTest = voyageRepository.findAll().size();
        // set the field null
        voyage.setDateDeVoyage(null);

        // Create the Voyage, which fails.

        restVoyageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyage)))
            .andExpect(status().isBadRequest());

        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVoyages() throws Exception {
        // Initialize the database
        voyageRepository.saveAndFlush(voyage);

        // Get all the voyageList
        restVoyageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voyage.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDeVoyage").value(hasItem(sameInstant(DEFAULT_DATE_DE_VOYAGE))))
            .andExpect(jsonPath("$.[*].prix").value(hasItem(DEFAULT_PRIX)))
            .andExpect(jsonPath("$.[*].nbrePlace").value(hasItem(DEFAULT_NBRE_PLACE)))
            .andExpect(jsonPath("$.[*].quartier").value(hasItem(DEFAULT_QUARTIER)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].climatisation").value(hasItem(DEFAULT_CLIMATISATION.booleanValue())))
            .andExpect(jsonPath("$.[*].wifi").value(hasItem(DEFAULT_WIFI.booleanValue())))
            .andExpect(jsonPath("$.[*].toilette").value(hasItem(DEFAULT_TOILETTE.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVoyagesWithEagerRelationshipsIsEnabled() throws Exception {
        when(voyageRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVoyageMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(voyageRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVoyagesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(voyageRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVoyageMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(voyageRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getVoyage() throws Exception {
        // Initialize the database
        voyageRepository.saveAndFlush(voyage);

        // Get the voyage
        restVoyageMockMvc
            .perform(get(ENTITY_API_URL_ID, voyage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voyage.getId().intValue()))
            .andExpect(jsonPath("$.dateDeVoyage").value(sameInstant(DEFAULT_DATE_DE_VOYAGE)))
            .andExpect(jsonPath("$.prix").value(DEFAULT_PRIX))
            .andExpect(jsonPath("$.nbrePlace").value(DEFAULT_NBRE_PLACE))
            .andExpect(jsonPath("$.quartier").value(DEFAULT_QUARTIER))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.climatisation").value(DEFAULT_CLIMATISATION.booleanValue()))
            .andExpect(jsonPath("$.wifi").value(DEFAULT_WIFI.booleanValue()))
            .andExpect(jsonPath("$.toilette").value(DEFAULT_TOILETTE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingVoyage() throws Exception {
        // Get the voyage
        restVoyageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVoyage() throws Exception {
        // Initialize the database
        voyageRepository.saveAndFlush(voyage);

        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();

        // Update the voyage
        Voyage updatedVoyage = voyageRepository.findById(voyage.getId()).get();
        // Disconnect from session so that the updates on updatedVoyage are not directly saved in db
        em.detach(updatedVoyage);
        updatedVoyage
            .dateDeVoyage(UPDATED_DATE_DE_VOYAGE)
            .prix(UPDATED_PRIX)
            .nbrePlace(UPDATED_NBRE_PLACE)
            .quartier(UPDATED_QUARTIER)
            .description(UPDATED_DESCRIPTION)
            .climatisation(UPDATED_CLIMATISATION)
            .wifi(UPDATED_WIFI)
            .toilette(UPDATED_TOILETTE);

        restVoyageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoyage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoyage))
            )
            .andExpect(status().isOk());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
        Voyage testVoyage = voyageList.get(voyageList.size() - 1);
        assertThat(testVoyage.getDateDeVoyage()).isEqualTo(UPDATED_DATE_DE_VOYAGE);
        assertThat(testVoyage.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testVoyage.getNbrePlace()).isEqualTo(UPDATED_NBRE_PLACE);
        assertThat(testVoyage.getQuartier()).isEqualTo(UPDATED_QUARTIER);
        assertThat(testVoyage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVoyage.getClimatisation()).isEqualTo(UPDATED_CLIMATISATION);
        assertThat(testVoyage.getWifi()).isEqualTo(UPDATED_WIFI);
        assertThat(testVoyage.getToilette()).isEqualTo(UPDATED_TOILETTE);
    }

    @Test
    @Transactional
    void putNonExistingVoyage() throws Exception {
        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();
        voyage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoyageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voyage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voyage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoyage() throws Exception {
        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();
        voyage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voyage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoyage() throws Exception {
        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();
        voyage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoyageWithPatch() throws Exception {
        // Initialize the database
        voyageRepository.saveAndFlush(voyage);

        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();

        // Update the voyage using partial update
        Voyage partialUpdatedVoyage = new Voyage();
        partialUpdatedVoyage.setId(voyage.getId());

        partialUpdatedVoyage.dateDeVoyage(UPDATED_DATE_DE_VOYAGE).prix(UPDATED_PRIX).quartier(UPDATED_QUARTIER).toilette(UPDATED_TOILETTE);

        restVoyageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoyage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoyage))
            )
            .andExpect(status().isOk());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
        Voyage testVoyage = voyageList.get(voyageList.size() - 1);
        assertThat(testVoyage.getDateDeVoyage()).isEqualTo(UPDATED_DATE_DE_VOYAGE);
        assertThat(testVoyage.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testVoyage.getNbrePlace()).isEqualTo(DEFAULT_NBRE_PLACE);
        assertThat(testVoyage.getQuartier()).isEqualTo(UPDATED_QUARTIER);
        assertThat(testVoyage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVoyage.getClimatisation()).isEqualTo(DEFAULT_CLIMATISATION);
        assertThat(testVoyage.getWifi()).isEqualTo(DEFAULT_WIFI);
        assertThat(testVoyage.getToilette()).isEqualTo(UPDATED_TOILETTE);
    }

    @Test
    @Transactional
    void fullUpdateVoyageWithPatch() throws Exception {
        // Initialize the database
        voyageRepository.saveAndFlush(voyage);

        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();

        // Update the voyage using partial update
        Voyage partialUpdatedVoyage = new Voyage();
        partialUpdatedVoyage.setId(voyage.getId());

        partialUpdatedVoyage
            .dateDeVoyage(UPDATED_DATE_DE_VOYAGE)
            .prix(UPDATED_PRIX)
            .nbrePlace(UPDATED_NBRE_PLACE)
            .quartier(UPDATED_QUARTIER)
            .description(UPDATED_DESCRIPTION)
            .climatisation(UPDATED_CLIMATISATION)
            .wifi(UPDATED_WIFI)
            .toilette(UPDATED_TOILETTE);

        restVoyageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoyage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoyage))
            )
            .andExpect(status().isOk());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
        Voyage testVoyage = voyageList.get(voyageList.size() - 1);
        assertThat(testVoyage.getDateDeVoyage()).isEqualTo(UPDATED_DATE_DE_VOYAGE);
        assertThat(testVoyage.getPrix()).isEqualTo(UPDATED_PRIX);
        assertThat(testVoyage.getNbrePlace()).isEqualTo(UPDATED_NBRE_PLACE);
        assertThat(testVoyage.getQuartier()).isEqualTo(UPDATED_QUARTIER);
        assertThat(testVoyage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVoyage.getClimatisation()).isEqualTo(UPDATED_CLIMATISATION);
        assertThat(testVoyage.getWifi()).isEqualTo(UPDATED_WIFI);
        assertThat(testVoyage.getToilette()).isEqualTo(UPDATED_TOILETTE);
    }

    @Test
    @Transactional
    void patchNonExistingVoyage() throws Exception {
        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();
        voyage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoyageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voyage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voyage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoyage() throws Exception {
        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();
        voyage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voyage))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoyage() throws Exception {
        int databaseSizeBeforeUpdate = voyageRepository.findAll().size();
        voyage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voyage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Voyage in the database
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoyage() throws Exception {
        // Initialize the database
        voyageRepository.saveAndFlush(voyage);

        int databaseSizeBeforeDelete = voyageRepository.findAll().size();

        // Delete the voyage
        restVoyageMockMvc
            .perform(delete(ENTITY_API_URL_ID, voyage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Voyage> voyageList = voyageRepository.findAll();
        assertThat(voyageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
