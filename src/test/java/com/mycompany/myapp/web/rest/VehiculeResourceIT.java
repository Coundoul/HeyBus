package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Vehicule;
import com.mycompany.myapp.repository.VehiculeRepository;
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
 * Integration tests for the {@link VehiculeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VehiculeResourceIT {

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_NUM_CHASSIS = "AAAAAAAAAA";
    private static final String UPDATED_NUM_CHASSIS = "BBBBBBBBBB";

    private static final String DEFAULT_NUM_CARTE_GRISE = "AAAAAAAAAA";
    private static final String UPDATED_NUM_CARTE_GRISE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NBRE_PLACE = 1;
    private static final Integer UPDATED_NBRE_PLACE = 2;

    private static final String DEFAULT_MARQUE_VOITURE = "AAAAAAAAAA";
    private static final String UPDATED_MARQUE_VOITURE = "BBBBBBBBBB";

    private static final String DEFAULT_PHOTO = "AAAAAAAAAA";
    private static final String UPDATED_PHOTO = "BBBBBBBBBB";

    private static final String DEFAULT_REFCARTETOTAL = "AAAAAAAAAA";
    private static final String UPDATED_REFCARTETOTAL = "BBBBBBBBBB";

    private static final String DEFAULT_TYPEMOTEUR = "AAAAAAAAAA";
    private static final String UPDATED_TYPEMOTEUR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/vehicules";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVehiculeMockMvc;

    private Vehicule vehicule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vehicule createEntity(EntityManager em) {
        Vehicule vehicule = new Vehicule()
            .reference(DEFAULT_REFERENCE)
            .numChassis(DEFAULT_NUM_CHASSIS)
            .numCarteGrise(DEFAULT_NUM_CARTE_GRISE)
            .nbrePlace(DEFAULT_NBRE_PLACE)
            .marqueVoiture(DEFAULT_MARQUE_VOITURE)
            .photo(DEFAULT_PHOTO)
            .refcartetotal(DEFAULT_REFCARTETOTAL)
            .typemoteur(DEFAULT_TYPEMOTEUR);
        return vehicule;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vehicule createUpdatedEntity(EntityManager em) {
        Vehicule vehicule = new Vehicule()
            .reference(UPDATED_REFERENCE)
            .numChassis(UPDATED_NUM_CHASSIS)
            .numCarteGrise(UPDATED_NUM_CARTE_GRISE)
            .nbrePlace(UPDATED_NBRE_PLACE)
            .marqueVoiture(UPDATED_MARQUE_VOITURE)
            .photo(UPDATED_PHOTO)
            .refcartetotal(UPDATED_REFCARTETOTAL)
            .typemoteur(UPDATED_TYPEMOTEUR);
        return vehicule;
    }

    @BeforeEach
    public void initTest() {
        vehicule = createEntity(em);
    }

    @Test
    @Transactional
    void createVehicule() throws Exception {
        int databaseSizeBeforeCreate = vehiculeRepository.findAll().size();
        // Create the Vehicule
        restVehiculeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehicule)))
            .andExpect(status().isCreated());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeCreate + 1);
        Vehicule testVehicule = vehiculeList.get(vehiculeList.size() - 1);
        assertThat(testVehicule.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testVehicule.getNumChassis()).isEqualTo(DEFAULT_NUM_CHASSIS);
        assertThat(testVehicule.getNumCarteGrise()).isEqualTo(DEFAULT_NUM_CARTE_GRISE);
        assertThat(testVehicule.getNbrePlace()).isEqualTo(DEFAULT_NBRE_PLACE);
        assertThat(testVehicule.getMarqueVoiture()).isEqualTo(DEFAULT_MARQUE_VOITURE);
        assertThat(testVehicule.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testVehicule.getRefcartetotal()).isEqualTo(DEFAULT_REFCARTETOTAL);
        assertThat(testVehicule.getTypemoteur()).isEqualTo(DEFAULT_TYPEMOTEUR);
    }

    @Test
    @Transactional
    void createVehiculeWithExistingId() throws Exception {
        // Create the Vehicule with an existing ID
        vehicule.setId(1L);

        int databaseSizeBeforeCreate = vehiculeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVehiculeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehicule)))
            .andExpect(status().isBadRequest());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkReferenceIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehiculeRepository.findAll().size();
        // set the field null
        vehicule.setReference(null);

        // Create the Vehicule, which fails.

        restVehiculeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehicule)))
            .andExpect(status().isBadRequest());

        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVehicules() throws Exception {
        // Initialize the database
        vehiculeRepository.saveAndFlush(vehicule);

        // Get all the vehiculeList
        restVehiculeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vehicule.getId().intValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].numChassis").value(hasItem(DEFAULT_NUM_CHASSIS)))
            .andExpect(jsonPath("$.[*].numCarteGrise").value(hasItem(DEFAULT_NUM_CARTE_GRISE)))
            .andExpect(jsonPath("$.[*].nbrePlace").value(hasItem(DEFAULT_NBRE_PLACE)))
            .andExpect(jsonPath("$.[*].marqueVoiture").value(hasItem(DEFAULT_MARQUE_VOITURE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(DEFAULT_PHOTO)))
            .andExpect(jsonPath("$.[*].refcartetotal").value(hasItem(DEFAULT_REFCARTETOTAL)))
            .andExpect(jsonPath("$.[*].typemoteur").value(hasItem(DEFAULT_TYPEMOTEUR)));
    }

    @Test
    @Transactional
    void getVehicule() throws Exception {
        // Initialize the database
        vehiculeRepository.saveAndFlush(vehicule);

        // Get the vehicule
        restVehiculeMockMvc
            .perform(get(ENTITY_API_URL_ID, vehicule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vehicule.getId().intValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.numChassis").value(DEFAULT_NUM_CHASSIS))
            .andExpect(jsonPath("$.numCarteGrise").value(DEFAULT_NUM_CARTE_GRISE))
            .andExpect(jsonPath("$.nbrePlace").value(DEFAULT_NBRE_PLACE))
            .andExpect(jsonPath("$.marqueVoiture").value(DEFAULT_MARQUE_VOITURE))
            .andExpect(jsonPath("$.photo").value(DEFAULT_PHOTO))
            .andExpect(jsonPath("$.refcartetotal").value(DEFAULT_REFCARTETOTAL))
            .andExpect(jsonPath("$.typemoteur").value(DEFAULT_TYPEMOTEUR));
    }

    @Test
    @Transactional
    void getNonExistingVehicule() throws Exception {
        // Get the vehicule
        restVehiculeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVehicule() throws Exception {
        // Initialize the database
        vehiculeRepository.saveAndFlush(vehicule);

        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();

        // Update the vehicule
        Vehicule updatedVehicule = vehiculeRepository.findById(vehicule.getId()).get();
        // Disconnect from session so that the updates on updatedVehicule are not directly saved in db
        em.detach(updatedVehicule);
        updatedVehicule
            .reference(UPDATED_REFERENCE)
            .numChassis(UPDATED_NUM_CHASSIS)
            .numCarteGrise(UPDATED_NUM_CARTE_GRISE)
            .nbrePlace(UPDATED_NBRE_PLACE)
            .marqueVoiture(UPDATED_MARQUE_VOITURE)
            .photo(UPDATED_PHOTO)
            .refcartetotal(UPDATED_REFCARTETOTAL)
            .typemoteur(UPDATED_TYPEMOTEUR);

        restVehiculeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVehicule.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVehicule))
            )
            .andExpect(status().isOk());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
        Vehicule testVehicule = vehiculeList.get(vehiculeList.size() - 1);
        assertThat(testVehicule.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testVehicule.getNumChassis()).isEqualTo(UPDATED_NUM_CHASSIS);
        assertThat(testVehicule.getNumCarteGrise()).isEqualTo(UPDATED_NUM_CARTE_GRISE);
        assertThat(testVehicule.getNbrePlace()).isEqualTo(UPDATED_NBRE_PLACE);
        assertThat(testVehicule.getMarqueVoiture()).isEqualTo(UPDATED_MARQUE_VOITURE);
        assertThat(testVehicule.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testVehicule.getRefcartetotal()).isEqualTo(UPDATED_REFCARTETOTAL);
        assertThat(testVehicule.getTypemoteur()).isEqualTo(UPDATED_TYPEMOTEUR);
    }

    @Test
    @Transactional
    void putNonExistingVehicule() throws Exception {
        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();
        vehicule.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehiculeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vehicule.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicule))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVehicule() throws Exception {
        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();
        vehicule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicule))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVehicule() throws Exception {
        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();
        vehicule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehicule)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVehiculeWithPatch() throws Exception {
        // Initialize the database
        vehiculeRepository.saveAndFlush(vehicule);

        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();

        // Update the vehicule using partial update
        Vehicule partialUpdatedVehicule = new Vehicule();
        partialUpdatedVehicule.setId(vehicule.getId());

        partialUpdatedVehicule
            .nbrePlace(UPDATED_NBRE_PLACE)
            .marqueVoiture(UPDATED_MARQUE_VOITURE)
            .photo(UPDATED_PHOTO)
            .refcartetotal(UPDATED_REFCARTETOTAL)
            .typemoteur(UPDATED_TYPEMOTEUR);

        restVehiculeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehicule))
            )
            .andExpect(status().isOk());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
        Vehicule testVehicule = vehiculeList.get(vehiculeList.size() - 1);
        assertThat(testVehicule.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testVehicule.getNumChassis()).isEqualTo(DEFAULT_NUM_CHASSIS);
        assertThat(testVehicule.getNumCarteGrise()).isEqualTo(DEFAULT_NUM_CARTE_GRISE);
        assertThat(testVehicule.getNbrePlace()).isEqualTo(UPDATED_NBRE_PLACE);
        assertThat(testVehicule.getMarqueVoiture()).isEqualTo(UPDATED_MARQUE_VOITURE);
        assertThat(testVehicule.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testVehicule.getRefcartetotal()).isEqualTo(UPDATED_REFCARTETOTAL);
        assertThat(testVehicule.getTypemoteur()).isEqualTo(UPDATED_TYPEMOTEUR);
    }

    @Test
    @Transactional
    void fullUpdateVehiculeWithPatch() throws Exception {
        // Initialize the database
        vehiculeRepository.saveAndFlush(vehicule);

        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();

        // Update the vehicule using partial update
        Vehicule partialUpdatedVehicule = new Vehicule();
        partialUpdatedVehicule.setId(vehicule.getId());

        partialUpdatedVehicule
            .reference(UPDATED_REFERENCE)
            .numChassis(UPDATED_NUM_CHASSIS)
            .numCarteGrise(UPDATED_NUM_CARTE_GRISE)
            .nbrePlace(UPDATED_NBRE_PLACE)
            .marqueVoiture(UPDATED_MARQUE_VOITURE)
            .photo(UPDATED_PHOTO)
            .refcartetotal(UPDATED_REFCARTETOTAL)
            .typemoteur(UPDATED_TYPEMOTEUR);

        restVehiculeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehicule))
            )
            .andExpect(status().isOk());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
        Vehicule testVehicule = vehiculeList.get(vehiculeList.size() - 1);
        assertThat(testVehicule.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testVehicule.getNumChassis()).isEqualTo(UPDATED_NUM_CHASSIS);
        assertThat(testVehicule.getNumCarteGrise()).isEqualTo(UPDATED_NUM_CARTE_GRISE);
        assertThat(testVehicule.getNbrePlace()).isEqualTo(UPDATED_NBRE_PLACE);
        assertThat(testVehicule.getMarqueVoiture()).isEqualTo(UPDATED_MARQUE_VOITURE);
        assertThat(testVehicule.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testVehicule.getRefcartetotal()).isEqualTo(UPDATED_REFCARTETOTAL);
        assertThat(testVehicule.getTypemoteur()).isEqualTo(UPDATED_TYPEMOTEUR);
    }

    @Test
    @Transactional
    void patchNonExistingVehicule() throws Exception {
        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();
        vehicule.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehiculeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vehicule.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicule))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVehicule() throws Exception {
        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();
        vehicule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicule))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVehicule() throws Exception {
        int databaseSizeBeforeUpdate = vehiculeRepository.findAll().size();
        vehicule.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vehicule)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vehicule in the database
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVehicule() throws Exception {
        // Initialize the database
        vehiculeRepository.saveAndFlush(vehicule);

        int databaseSizeBeforeDelete = vehiculeRepository.findAll().size();

        // Delete the vehicule
        restVehiculeMockMvc
            .perform(delete(ENTITY_API_URL_ID, vehicule.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vehicule> vehiculeList = vehiculeRepository.findAll();
        assertThat(vehiculeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
