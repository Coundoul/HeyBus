package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Fuel;
import com.mycompany.myapp.domain.Vehicule;
import com.mycompany.myapp.repository.FuelRepository;
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
 * Integration tests for the {@link FuelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FuelResourceIT {

    private static final String DEFAULT_TYPE_DE_CARBURANT = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_DE_CARBURANT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_KM = 1;
    private static final Integer UPDATED_KM = 2;

    private static final Integer DEFAULT_NB_LITRE = 1;
    private static final Integer UPDATED_NB_LITRE = 2;

    private static final Double DEFAULT_MONTANT = 1D;
    private static final Double UPDATED_MONTANT = 2D;

    private static final String ENTITY_API_URL = "/api/fuels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FuelRepository fuelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFuelMockMvc;

    private Fuel fuel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fuel createEntity(EntityManager em) {
        Fuel fuel = new Fuel()
            .typeDeCarburant(DEFAULT_TYPE_DE_CARBURANT)
            .date(DEFAULT_DATE)
            .km(DEFAULT_KM)
            .nbLitre(DEFAULT_NB_LITRE)
            .montant(DEFAULT_MONTANT);
        // Add required entity
        Vehicule vehicule;
        if (TestUtil.findAll(em, Vehicule.class).isEmpty()) {
            vehicule = VehiculeResourceIT.createEntity(em);
            em.persist(vehicule);
            em.flush();
        } else {
            vehicule = TestUtil.findAll(em, Vehicule.class).get(0);
        }
        fuel.setVehicule(vehicule);
        return fuel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fuel createUpdatedEntity(EntityManager em) {
        Fuel fuel = new Fuel()
            .typeDeCarburant(UPDATED_TYPE_DE_CARBURANT)
            .date(UPDATED_DATE)
            .km(UPDATED_KM)
            .nbLitre(UPDATED_NB_LITRE)
            .montant(UPDATED_MONTANT);
        // Add required entity
        Vehicule vehicule;
        if (TestUtil.findAll(em, Vehicule.class).isEmpty()) {
            vehicule = VehiculeResourceIT.createUpdatedEntity(em);
            em.persist(vehicule);
            em.flush();
        } else {
            vehicule = TestUtil.findAll(em, Vehicule.class).get(0);
        }
        fuel.setVehicule(vehicule);
        return fuel;
    }

    @BeforeEach
    public void initTest() {
        fuel = createEntity(em);
    }

    @Test
    @Transactional
    void createFuel() throws Exception {
        int databaseSizeBeforeCreate = fuelRepository.findAll().size();
        // Create the Fuel
        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isCreated());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeCreate + 1);
        Fuel testFuel = fuelList.get(fuelList.size() - 1);
        assertThat(testFuel.getTypeDeCarburant()).isEqualTo(DEFAULT_TYPE_DE_CARBURANT);
        assertThat(testFuel.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFuel.getKm()).isEqualTo(DEFAULT_KM);
        assertThat(testFuel.getNbLitre()).isEqualTo(DEFAULT_NB_LITRE);
        assertThat(testFuel.getMontant()).isEqualTo(DEFAULT_MONTANT);
    }

    @Test
    @Transactional
    void createFuelWithExistingId() throws Exception {
        // Create the Fuel with an existing ID
        fuel.setId(1L);

        int databaseSizeBeforeCreate = fuelRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isBadRequest());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTypeDeCarburantIsRequired() throws Exception {
        int databaseSizeBeforeTest = fuelRepository.findAll().size();
        // set the field null
        fuel.setTypeDeCarburant(null);

        // Create the Fuel, which fails.

        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isBadRequest());

        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = fuelRepository.findAll().size();
        // set the field null
        fuel.setDate(null);

        // Create the Fuel, which fails.

        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isBadRequest());

        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkKmIsRequired() throws Exception {
        int databaseSizeBeforeTest = fuelRepository.findAll().size();
        // set the field null
        fuel.setKm(null);

        // Create the Fuel, which fails.

        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isBadRequest());

        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNbLitreIsRequired() throws Exception {
        int databaseSizeBeforeTest = fuelRepository.findAll().size();
        // set the field null
        fuel.setNbLitre(null);

        // Create the Fuel, which fails.

        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isBadRequest());

        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMontantIsRequired() throws Exception {
        int databaseSizeBeforeTest = fuelRepository.findAll().size();
        // set the field null
        fuel.setMontant(null);

        // Create the Fuel, which fails.

        restFuelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isBadRequest());

        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFuels() throws Exception {
        // Initialize the database
        fuelRepository.saveAndFlush(fuel);

        // Get all the fuelList
        restFuelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fuel.getId().intValue())))
            .andExpect(jsonPath("$.[*].typeDeCarburant").value(hasItem(DEFAULT_TYPE_DE_CARBURANT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].km").value(hasItem(DEFAULT_KM)))
            .andExpect(jsonPath("$.[*].nbLitre").value(hasItem(DEFAULT_NB_LITRE)))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.doubleValue())));
    }

    @Test
    @Transactional
    void getFuel() throws Exception {
        // Initialize the database
        fuelRepository.saveAndFlush(fuel);

        // Get the fuel
        restFuelMockMvc
            .perform(get(ENTITY_API_URL_ID, fuel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fuel.getId().intValue()))
            .andExpect(jsonPath("$.typeDeCarburant").value(DEFAULT_TYPE_DE_CARBURANT))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.km").value(DEFAULT_KM))
            .andExpect(jsonPath("$.nbLitre").value(DEFAULT_NB_LITRE))
            .andExpect(jsonPath("$.montant").value(DEFAULT_MONTANT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingFuel() throws Exception {
        // Get the fuel
        restFuelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFuel() throws Exception {
        // Initialize the database
        fuelRepository.saveAndFlush(fuel);

        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();

        // Update the fuel
        Fuel updatedFuel = fuelRepository.findById(fuel.getId()).get();
        // Disconnect from session so that the updates on updatedFuel are not directly saved in db
        em.detach(updatedFuel);
        updatedFuel
            .typeDeCarburant(UPDATED_TYPE_DE_CARBURANT)
            .date(UPDATED_DATE)
            .km(UPDATED_KM)
            .nbLitre(UPDATED_NB_LITRE)
            .montant(UPDATED_MONTANT);

        restFuelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFuel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFuel))
            )
            .andExpect(status().isOk());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
        Fuel testFuel = fuelList.get(fuelList.size() - 1);
        assertThat(testFuel.getTypeDeCarburant()).isEqualTo(UPDATED_TYPE_DE_CARBURANT);
        assertThat(testFuel.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFuel.getKm()).isEqualTo(UPDATED_KM);
        assertThat(testFuel.getNbLitre()).isEqualTo(UPDATED_NB_LITRE);
        assertThat(testFuel.getMontant()).isEqualTo(UPDATED_MONTANT);
    }

    @Test
    @Transactional
    void putNonExistingFuel() throws Exception {
        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();
        fuel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFuelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fuel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fuel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFuel() throws Exception {
        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();
        fuel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fuel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFuel() throws Exception {
        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();
        fuel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFuelWithPatch() throws Exception {
        // Initialize the database
        fuelRepository.saveAndFlush(fuel);

        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();

        // Update the fuel using partial update
        Fuel partialUpdatedFuel = new Fuel();
        partialUpdatedFuel.setId(fuel.getId());

        partialUpdatedFuel.typeDeCarburant(UPDATED_TYPE_DE_CARBURANT).km(UPDATED_KM).nbLitre(UPDATED_NB_LITRE);

        restFuelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFuel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFuel))
            )
            .andExpect(status().isOk());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
        Fuel testFuel = fuelList.get(fuelList.size() - 1);
        assertThat(testFuel.getTypeDeCarburant()).isEqualTo(UPDATED_TYPE_DE_CARBURANT);
        assertThat(testFuel.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFuel.getKm()).isEqualTo(UPDATED_KM);
        assertThat(testFuel.getNbLitre()).isEqualTo(UPDATED_NB_LITRE);
        assertThat(testFuel.getMontant()).isEqualTo(DEFAULT_MONTANT);
    }

    @Test
    @Transactional
    void fullUpdateFuelWithPatch() throws Exception {
        // Initialize the database
        fuelRepository.saveAndFlush(fuel);

        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();

        // Update the fuel using partial update
        Fuel partialUpdatedFuel = new Fuel();
        partialUpdatedFuel.setId(fuel.getId());

        partialUpdatedFuel
            .typeDeCarburant(UPDATED_TYPE_DE_CARBURANT)
            .date(UPDATED_DATE)
            .km(UPDATED_KM)
            .nbLitre(UPDATED_NB_LITRE)
            .montant(UPDATED_MONTANT);

        restFuelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFuel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFuel))
            )
            .andExpect(status().isOk());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
        Fuel testFuel = fuelList.get(fuelList.size() - 1);
        assertThat(testFuel.getTypeDeCarburant()).isEqualTo(UPDATED_TYPE_DE_CARBURANT);
        assertThat(testFuel.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFuel.getKm()).isEqualTo(UPDATED_KM);
        assertThat(testFuel.getNbLitre()).isEqualTo(UPDATED_NB_LITRE);
        assertThat(testFuel.getMontant()).isEqualTo(UPDATED_MONTANT);
    }

    @Test
    @Transactional
    void patchNonExistingFuel() throws Exception {
        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();
        fuel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFuelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fuel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fuel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFuel() throws Exception {
        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();
        fuel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fuel))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFuel() throws Exception {
        int databaseSizeBeforeUpdate = fuelRepository.findAll().size();
        fuel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuelMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fuel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fuel in the database
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFuel() throws Exception {
        // Initialize the database
        fuelRepository.saveAndFlush(fuel);

        int databaseSizeBeforeDelete = fuelRepository.findAll().size();

        // Delete the fuel
        restFuelMockMvc
            .perform(delete(ENTITY_API_URL_ID, fuel.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fuel> fuelList = fuelRepository.findAll();
        assertThat(fuelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
