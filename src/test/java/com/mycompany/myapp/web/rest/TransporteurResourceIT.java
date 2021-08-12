package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Transporteur;
import com.mycompany.myapp.repository.TransporteurRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link TransporteurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TransporteurResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String DEFAULT_RESPONSABLE = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSABLE = "BBBBBBBBBB";

    private static final String DEFAULT_MAIL = "AAAAAAAAAA";
    private static final String UPDATED_MAIL = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/transporteurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TransporteurRepository transporteurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTransporteurMockMvc;

    private Transporteur transporteur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transporteur createEntity(EntityManager em) {
        Transporteur transporteur = new Transporteur()
            .nom(DEFAULT_NOM)
            .telephone(DEFAULT_TELEPHONE)
            .responsable(DEFAULT_RESPONSABLE)
            .mail(DEFAULT_MAIL)
            .adresse(DEFAULT_ADRESSE)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE);
        return transporteur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transporteur createUpdatedEntity(EntityManager em) {
        Transporteur transporteur = new Transporteur()
            .nom(UPDATED_NOM)
            .telephone(UPDATED_TELEPHONE)
            .responsable(UPDATED_RESPONSABLE)
            .mail(UPDATED_MAIL)
            .adresse(UPDATED_ADRESSE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);
        return transporteur;
    }

    @BeforeEach
    public void initTest() {
        transporteur = createEntity(em);
    }

    @Test
    @Transactional
    void createTransporteur() throws Exception {
        int databaseSizeBeforeCreate = transporteurRepository.findAll().size();
        // Create the Transporteur
        restTransporteurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isCreated());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeCreate + 1);
        Transporteur testTransporteur = transporteurList.get(transporteurList.size() - 1);
        assertThat(testTransporteur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testTransporteur.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
        assertThat(testTransporteur.getResponsable()).isEqualTo(DEFAULT_RESPONSABLE);
        assertThat(testTransporteur.getMail()).isEqualTo(DEFAULT_MAIL);
        assertThat(testTransporteur.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testTransporteur.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testTransporteur.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createTransporteurWithExistingId() throws Exception {
        // Create the Transporteur with an existing ID
        transporteur.setId(1L);

        int databaseSizeBeforeCreate = transporteurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransporteurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isBadRequest());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = transporteurRepository.findAll().size();
        // set the field null
        transporteur.setNom(null);

        // Create the Transporteur, which fails.

        restTransporteurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isBadRequest());

        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTelephoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = transporteurRepository.findAll().size();
        // set the field null
        transporteur.setTelephone(null);

        // Create the Transporteur, which fails.

        restTransporteurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isBadRequest());

        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkResponsableIsRequired() throws Exception {
        int databaseSizeBeforeTest = transporteurRepository.findAll().size();
        // set the field null
        transporteur.setResponsable(null);

        // Create the Transporteur, which fails.

        restTransporteurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isBadRequest());

        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAdresseIsRequired() throws Exception {
        int databaseSizeBeforeTest = transporteurRepository.findAll().size();
        // set the field null
        transporteur.setAdresse(null);

        // Create the Transporteur, which fails.

        restTransporteurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isBadRequest());

        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTransporteurs() throws Exception {
        // Initialize the database
        transporteurRepository.saveAndFlush(transporteur);

        // Get all the transporteurList
        restTransporteurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transporteur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)))
            .andExpect(jsonPath("$.[*].responsable").value(hasItem(DEFAULT_RESPONSABLE)))
            .andExpect(jsonPath("$.[*].mail").value(hasItem(DEFAULT_MAIL)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))));
    }

    @Test
    @Transactional
    void getTransporteur() throws Exception {
        // Initialize the database
        transporteurRepository.saveAndFlush(transporteur);

        // Get the transporteur
        restTransporteurMockMvc
            .perform(get(ENTITY_API_URL_ID, transporteur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(transporteur.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE))
            .andExpect(jsonPath("$.responsable").value(DEFAULT_RESPONSABLE))
            .andExpect(jsonPath("$.mail").value(DEFAULT_MAIL))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)));
    }

    @Test
    @Transactional
    void getNonExistingTransporteur() throws Exception {
        // Get the transporteur
        restTransporteurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTransporteur() throws Exception {
        // Initialize the database
        transporteurRepository.saveAndFlush(transporteur);

        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();

        // Update the transporteur
        Transporteur updatedTransporteur = transporteurRepository.findById(transporteur.getId()).get();
        // Disconnect from session so that the updates on updatedTransporteur are not directly saved in db
        em.detach(updatedTransporteur);
        updatedTransporteur
            .nom(UPDATED_NOM)
            .telephone(UPDATED_TELEPHONE)
            .responsable(UPDATED_RESPONSABLE)
            .mail(UPDATED_MAIL)
            .adresse(UPDATED_ADRESSE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restTransporteurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTransporteur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTransporteur))
            )
            .andExpect(status().isOk());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
        Transporteur testTransporteur = transporteurList.get(transporteurList.size() - 1);
        assertThat(testTransporteur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testTransporteur.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testTransporteur.getResponsable()).isEqualTo(UPDATED_RESPONSABLE);
        assertThat(testTransporteur.getMail()).isEqualTo(UPDATED_MAIL);
        assertThat(testTransporteur.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testTransporteur.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testTransporteur.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingTransporteur() throws Exception {
        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();
        transporteur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransporteurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, transporteur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transporteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTransporteur() throws Exception {
        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();
        transporteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransporteurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(transporteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTransporteur() throws Exception {
        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();
        transporteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransporteurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(transporteur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTransporteurWithPatch() throws Exception {
        // Initialize the database
        transporteurRepository.saveAndFlush(transporteur);

        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();

        // Update the transporteur using partial update
        Transporteur partialUpdatedTransporteur = new Transporteur();
        partialUpdatedTransporteur.setId(transporteur.getId());

        partialUpdatedTransporteur
            .nom(UPDATED_NOM)
            .telephone(UPDATED_TELEPHONE)
            .mail(UPDATED_MAIL)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restTransporteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransporteur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransporteur))
            )
            .andExpect(status().isOk());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
        Transporteur testTransporteur = transporteurList.get(transporteurList.size() - 1);
        assertThat(testTransporteur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testTransporteur.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testTransporteur.getResponsable()).isEqualTo(DEFAULT_RESPONSABLE);
        assertThat(testTransporteur.getMail()).isEqualTo(UPDATED_MAIL);
        assertThat(testTransporteur.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testTransporteur.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testTransporteur.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateTransporteurWithPatch() throws Exception {
        // Initialize the database
        transporteurRepository.saveAndFlush(transporteur);

        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();

        // Update the transporteur using partial update
        Transporteur partialUpdatedTransporteur = new Transporteur();
        partialUpdatedTransporteur.setId(transporteur.getId());

        partialUpdatedTransporteur
            .nom(UPDATED_NOM)
            .telephone(UPDATED_TELEPHONE)
            .responsable(UPDATED_RESPONSABLE)
            .mail(UPDATED_MAIL)
            .adresse(UPDATED_ADRESSE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE);

        restTransporteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTransporteur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTransporteur))
            )
            .andExpect(status().isOk());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
        Transporteur testTransporteur = transporteurList.get(transporteurList.size() - 1);
        assertThat(testTransporteur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testTransporteur.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
        assertThat(testTransporteur.getResponsable()).isEqualTo(UPDATED_RESPONSABLE);
        assertThat(testTransporteur.getMail()).isEqualTo(UPDATED_MAIL);
        assertThat(testTransporteur.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testTransporteur.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testTransporteur.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingTransporteur() throws Exception {
        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();
        transporteur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransporteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, transporteur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transporteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTransporteur() throws Exception {
        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();
        transporteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransporteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(transporteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTransporteur() throws Exception {
        int databaseSizeBeforeUpdate = transporteurRepository.findAll().size();
        transporteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTransporteurMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(transporteur))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Transporteur in the database
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTransporteur() throws Exception {
        // Initialize the database
        transporteurRepository.saveAndFlush(transporteur);

        int databaseSizeBeforeDelete = transporteurRepository.findAll().size();

        // Delete the transporteur
        restTransporteurMockMvc
            .perform(delete(ENTITY_API_URL_ID, transporteur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transporteur> transporteurList = transporteurRepository.findAll();
        assertThat(transporteurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
