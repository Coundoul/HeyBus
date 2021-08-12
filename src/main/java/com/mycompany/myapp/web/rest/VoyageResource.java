package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Voyage;
import com.mycompany.myapp.repository.VilleRepository;
import com.mycompany.myapp.repository.VoyageRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.MailService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Voyage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VoyageResource {

    private final Logger log = LoggerFactory.getLogger(VoyageResource.class);

    private static final String ENTITY_NAME = "voyage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private VilleRepository ville;
    
    @Autowired
    private MailService mailService;
    
    private final VoyageRepository voyageRepository;

    public VoyageResource(VoyageRepository voyageRepository) {
        this.voyageRepository = voyageRepository;
    }

    /**
     * {@code POST  /voyages} : Create a new voyage.
     *
     * @param voyage the voyage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voyage, or with status {@code 400 (Bad Request)} if the voyage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/voyages")
    public ResponseEntity<Voyage> createVoyage(@Valid @RequestBody Voyage voyage) throws URISyntaxException {
        log.debug("REST request to save Voyage : {}", voyage);
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_TRANSPORTEUR")) {
            //set the Current Transporteur
            voyage.setTransporteur(voyageRepository.findCurrentTransporteur());
        }

        if (voyage.getId() != null) {
            throw new BadRequestAlertException("A new voyage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Voyage result = voyageRepository.save(voyage);
        return ResponseEntity
            .created(new URI("/api/voyages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /voyages/:id} : Updates an existing voyage.
     *
     * @param id the id of the voyage to save.
     * @param voyage the voyage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voyage,
     * or with status {@code 400 (Bad Request)} if the voyage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voyage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/voyages/{id}")
    public ResponseEntity<Voyage> updateVoyage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Voyage voyage
    ) throws URISyntaxException {
        log.debug("REST request to update Voyage : {}, {}", id, voyage);
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_TRANSPORTEUR")) {
            //set the Current Transporteur
            voyage.setTransporteur(voyageRepository.findCurrentTransporteur());
        }

        if (voyage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voyage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voyageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Voyage result = voyageRepository.save(voyage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voyage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /voyages/:id} : Partial updates given fields of an existing voyage, field will ignore if it is null
     *
     * @param id the id of the voyage to save.
     * @param voyage the voyage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voyage,
     * or with status {@code 400 (Bad Request)} if the voyage is not valid,
     * or with status {@code 404 (Not Found)} if the voyage is not found,
     * or with status {@code 500 (Internal Server Error)} if the voyage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/voyages/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Voyage> partialUpdateVoyage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Voyage voyage
    ) throws URISyntaxException {
        log.debug("REST request to partial update Voyage partially : {}, {}", id, voyage);
        if (voyage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voyage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!voyageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Voyage> result = voyageRepository
            .findById(voyage.getId())
            .map(
                existingVoyage -> {
                    if (voyage.getDateDeVoyage() != null) {
                        existingVoyage.setDateDeVoyage(voyage.getDateDeVoyage());
                    }
                    if (voyage.getPrix() != null) {
                        existingVoyage.setPrix(voyage.getPrix());
                    }
                    if (voyage.getNbrePlace() != null) {
                        existingVoyage.setNbrePlace(voyage.getNbrePlace());
                    }
                    if (voyage.getAdresseDepart() != null) {
                        existingVoyage.setAdresseDepart(voyage.getAdresseDepart());
                    }
                    if (voyage.getAdresseArrive() != null) {
                        existingVoyage.setAdresseArrive(voyage.getAdresseArrive());
                    }
                    if (voyage.getQuartier() != null) {
                        existingVoyage.setQuartier(voyage.getQuartier());
                    }
                    if (voyage.getDescription() != null) {
                        existingVoyage.setDescription(voyage.getDescription());
                    }
                    if (voyage.getClimatisation() != null) {
                        existingVoyage.setClimatisation(voyage.getClimatisation());
                    }
                    if (voyage.getWifi() != null) {
                        existingVoyage.setWifi(voyage.getWifi());
                    }
                    if (voyage.getToilette() != null) {
                        existingVoyage.setToilette(voyage.getToilette());
                    }

                    return existingVoyage;
                }
            )
            .map(voyageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, voyage.getId().toString())
        );
    }

    /**
     * {@code GET  /voyages} : get all the voyages.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of voyages in body.
     */
    @GetMapping("/voyages")
    public ResponseEntity<List<Voyage>> getAllVoyages(
        Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Voyages");
        Page<Voyage> page = null;
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_TRANSPORTEUR")) {
            if (eagerload) {
                page = voyageRepository.findByUserIsCurrentUser(pageable);
            } else {
                page = voyageRepository.findByUserIsCurrentUser(pageable);
            }
        }
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")) {
            if (eagerload) {
                page = voyageRepository.findAllWithEagerRelationships(pageable);
            } else {
                page = voyageRepository.findAll(pageable);
            }
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /voyages/:id} : get the "id" voyage.
     *
     * @param id the id of the voyage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voyage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/voyages/{id}")
    public ResponseEntity<Voyage> getVoyage(@PathVariable Long id) {
        log.debug("REST request to get Voyage : {}", id);
        Optional<Voyage> voyage = voyageRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(voyage);
    }

    /**
     * {@code DELETE  /voyages/:id} : delete the "id" voyage.
     *
     * @param id the id of the voyage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/voyages/{id}")
    public ResponseEntity<Void> deleteVoyage(@PathVariable Long id) {
        log.debug("REST request to delete Voyage : {}", id);
        voyageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/voyages/{dateVoyage}/{idDepartVille}/{idArriveVille}/{nbrePassagers}")
    public ResponseEntity<List<Voyage>> getVoyage(
        @PathVariable String dateVoyage,
        @PathVariable Long idDepartVille,
        @PathVariable Long idArriveVille,
        @PathVariable Integer nbrePassagers,
        Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        //log.debug("REST request to get Voyage : {}", id);

        ZonedDateTime date = ZonedDateTime.of(
            Integer.parseInt(dateVoyage.split("-")[0]),
            Integer.parseInt(dateVoyage.split("-")[1]),
            Integer.parseInt(dateVoyage.split("-")[2]),
            0,
            0,
            0,
            0,
            ZoneId.of("UTC")
        );
        ZonedDateTime date2 = ZonedDateTime.of(
            Integer.parseInt(dateVoyage.split("-")[0]),
            Integer.parseInt(dateVoyage.split("-")[1]),
            Integer.parseInt(dateVoyage.split("-")[2]),
            23,
            59,
            59,
            0,
            ZoneId.of("UTC")
        );
        Page<Voyage> page = null;
        if (eagerload) {
            page =
                voyageRepository.findByDateDeVoyageBetweenAndDepartVilleAndArriveVilleAndNbrePlaceGreaterThanEqual(
                    pageable,
                    date,
                    date2,
                    ville.findById(idDepartVille).get(),
                    ville.findById(idArriveVille).get(),
                    nbrePassagers
                );
        } else {
            page =
                voyageRepository.findByDateDeVoyageBetweenAndDepartVilleAndArriveVilleAndNbrePlaceGreaterThanEqual(
                    pageable,
                    date,
                    date2,
                    ville.findById(idDepartVille).get(),
                    ville.findById(idArriveVille).get(),
                    nbrePassagers
                );
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    // Api aller-retour
    @GetMapping("/voyages/retour")
    public ResponseEntity<List<Voyage>> getVoyageRetour(
        @RequestParam String dateVoyage,
        @RequestParam String dateRetour,
        @RequestParam Long idDepartVille,
        @RequestParam Long idArriveVille,
        @RequestParam Integer nbrePassagers,
        Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        ZonedDateTime date1 = ZonedDateTime.of(
            Integer.parseInt(dateVoyage.split("-")[0]),
            Integer.parseInt(dateVoyage.split("-")[1]),
            Integer.parseInt(dateVoyage.split("-")[2]),
            0,
            0,
            0,
            0,
            ZoneId.of("UTC")
        );
        ZonedDateTime date2 = ZonedDateTime.of(
            Integer.parseInt(dateVoyage.split("-")[0]),
            Integer.parseInt(dateVoyage.split("-")[1]),
            Integer.parseInt(dateVoyage.split("-")[2]),
            23,
            59,
            59,
            0,
            ZoneId.of("UTC")
        );

        ZonedDateTime date3 = ZonedDateTime.of(
            Integer.parseInt(dateRetour.split("-")[0]),
            Integer.parseInt(dateRetour.split("-")[1]),
            Integer.parseInt(dateRetour.split("-")[2]),
            0,
            0,
            0,
            0,
            ZoneId.of("UTC")
        );
        ZonedDateTime date4 = ZonedDateTime.of(
            Integer.parseInt(dateRetour.split("-")[0]),
            Integer.parseInt(dateRetour.split("-")[1]),
            Integer.parseInt(dateRetour.split("-")[2]),
            23,
            59,
            59,
            0,
            ZoneId.of("UTC")
        );
        Page<Voyage> page = null;
        if (eagerload) {
            page =
                voyageRepository.voyageRetour(
                    date1,
                    date2,
                    date3,
                    date4,
                    ville.findById(idDepartVille).get(),
                    ville.findById(idArriveVille).get(),
                    nbrePassagers,
                    pageable
                );
        } else {
            page =
                voyageRepository.voyageRetour(
                    date1,
                    date2,
                    date3,
                    date4,
                    ville.findById(idDepartVille).get(),
                    ville.findById(idArriveVille).get(),
                    nbrePassagers,
                    pageable
                );
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }


    @GetMapping("/voyages/louer/{nom}/{mail}/{tel}/{message}")
    public String sendLocation(
        @PathVariable String nom,
        @PathVariable String mail,
        @PathVariable String tel,
        @PathVariable String message,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        mailService.sendEmail(
        "ithiame.dts@gmail.com",
        "Demande de location de bus sur HeyBus", 
        "Voici les informations:\nEntreprise: "+nom+"\nE-mail: "+mail+"\nTel: "+tel+"\nMessage: "+message,
        true, 
        true);
        return "Votre demande de location de bus a été bien envoyée";
    }
}
