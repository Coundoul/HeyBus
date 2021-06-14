package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.Voyage;
import com.mycompany.myapp.domain.Reservation;
import com.mycompany.myapp.repository.CustomerRepository;
import com.mycompany.myapp.repository.ReservationRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.repository.VoyageRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.MailService;
import com.mycompany.myapp.service.UserService;
import com.mycompany.myapp.service.dto.AdminUserDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.errors.LoginAlreadyUsedException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

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
 * REST controller for managing {@link com.mycompany.myapp.domain.Reservation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReservationResource {

    private final Logger log = LoggerFactory.getLogger(ReservationResource.class);

    private static final String ENTITY_NAME = "reservation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private VoyageRepository voyageRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    private final ReservationRepository reservationRepository;

    public ReservationResource(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    /**
     * {@code POST  /reservations} : Create a new reservation.
     *
     * @param reservation the reservation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new reservation, or with status {@code 400 (Bad Request)} if
     *         the reservation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reservations")
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation)
            throws URISyntaxException {
        log.debug("REST request to save Reservation : {}", reservation);
        if (reservation.getId() != null) {
            throw new BadRequestAlertException("A new reservation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Reservation result = reservationRepository.save(reservation);
        return ResponseEntity
                .created(new URI("/api/reservations/" + result.getId())).headers(HeaderUtil
                        .createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /reservations/:id} : Updates an existing reservation.
     *
     * @param id          the id of the reservation to save.
     * @param reservation the reservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated reservation, or with status {@code 400 (Bad Request)} if
     *         the reservation is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the reservation couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reservations/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable(value = "id", required = false) final Long id,
            @RequestBody Reservation reservation) throws URISyntaxException {
        log.debug("REST request to update Reservation : {}, {}", id, reservation);
        if (reservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Reservation result = reservationRepository.save(reservation);
        return ResponseEntity.ok().headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservation.getId().toString()))
                .body(result);
    }

    /**
     * {@code PATCH  /reservations/:id} : Partial updates given fields of an
     * existing reservation, field will ignore if it is null
     *
     * @param id          the id of the reservation to save.
     * @param reservation the reservation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated reservation, or with status {@code 400 (Bad Request)} if
     *         the reservation is not valid, or with status {@code 404 (Not Found)}
     *         if the reservation is not found, or with status
     *         {@code 500 (Internal Server Error)} if the reservation couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reservations/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Reservation> partialUpdateReservation(
            @PathVariable(value = "id", required = false) final Long id, @RequestBody Reservation reservation)
            throws URISyntaxException {
        log.debug("REST request to partial update Reservation partially : {}, {}", id, reservation);
        if (reservation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reservation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reservationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Reservation> result = reservationRepository.findById(reservation.getId()).map(existingReservation -> {
            if (reservation.getDateDeReservation() != null) {
                existingReservation.setDateDeReservation(reservation.getDateDeReservation());
            }
            if (reservation.getNbrePassagers() != null) {
                existingReservation.setNbrePassagers(reservation.getNbrePassagers());
            }
            if (reservation.getPrixReservation() != null) {
                existingReservation.setPrixReservation(reservation.getPrixReservation());
            }

            return existingReservation;
        }).map(reservationRepository::save);

        return ResponseUtil.wrapOrNotFound(result,
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reservation.getId().toString()));
    }

    /**
     * {@code GET  /reservations} : get all the reservations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of reservations in body.
     */
    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations(Pageable pageable) {
        log.debug("REST request to get a page of Reservations");
        
        Page<Reservation> page = null;

        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_USER")) {
            if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")) {
                page = reservationRepository.findAll(pageable);
            } else {
                page = reservationRepository.findByCustomerIsCurrentCustomer(pageable);
            }

        }

        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_TRANSPORTEUR"))
            page = reservationRepository.findByUserIsCurrentUser(pageable);

        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reservations/:id} : get the "id" reservation.
     *
     * @param id the id of the reservation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the reservation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reservations/{id}")
    public ResponseEntity<Reservation> getReservation(@PathVariable Long id) {
        log.debug("REST request to get Reservation : {}", id);
        Optional<Reservation> reservation = reservationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reservation);
    }

    /**
     * {@code DELETE  /reservations/:id} : delete the "id" reservation.
     *
     * @param id the id of the reservation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        log.debug("REST request to delete Reservation : {}", id);
        reservationRepository.deleteById(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    /**
     * {@code POST  /reservations} : Create a new reservation.
     *
     * @param reservation the reservation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new reservation, or with status {@code 400 (Bad Request)} if
     *         the reservation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reservations/voyage/{voyageId}/passagers/{nbrePassagers}")
    public ResponseEntity<Reservation> createReservationVoyageCustomer(@RequestBody Customer customer,
            @PathVariable Long voyageId, @PathVariable Integer nbrePassagers) throws URISyntaxException {
        log.debug("REST request to save Customer Reservation : {}", customer);

        Optional<Customer> customerExisting = customerRepository.findOneByEmailIgnoreCase(customer.getEmail());

        if (customerExisting.isPresent()) {

            customerExisting.get().setTelephone(customer.getTelephone());
            customerExisting.get().setNom(customer.getNom());
            customerExisting.get().setPrenom(customer.getPrenom());
            customerRepository.save(customerExisting.get());

            Voyage voyage = voyageRepository.findById(voyageId).get();

            Reservation reservation = new Reservation();
            reservation.setDateDeReservation(LocalDate.now());
            reservation.setCustomer(customerExisting.get());
            reservation.setVoyage(voyage);
            reservation.setNbrePassagers(nbrePassagers);
            reservation.setPrixReservation(Integer.valueOf(voyage.getPrix() * nbrePassagers));
            Reservation result = reservationRepository.save(reservation);

            voyage.setNbrePlace(voyage.getNbrePlace() - nbrePassagers);
            voyageRepository.save(voyage);
            return ResponseEntity.created(new URI("/api/reservations/voyage/" + voyageId + "/"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                            "\n Reservation reussi pour votre compte " + customerExisting.get().getEmail().toString()))
                    .body(result);

        } else {

            AdminUserDTO user = new AdminUserDTO();
            user.setEmail(customer.getEmail());
            user.setActivated(true);
            user.setLogin(customer.getEmail());
            Set<String> role = new HashSet<String>();
            role.add("ROLE_USER");
            user.setAuthorities(role);

            if (userRepository.findOneByLogin(user.getLogin().toLowerCase()).isPresent()) {
                throw new LoginAlreadyUsedException();
            } else {
                User newUser = userService.createUser(user);
                mailService.sendCreationEmail(newUser);
                customer.setUser(newUser);
            }
            Customer customerResult = customerRepository.save(customer);

            Voyage voyage = voyageRepository.findById(voyageId).get();

            Reservation reservation = new Reservation();
            reservation.setDateDeReservation(LocalDate.now());
            reservation.setCustomer(customerResult);
            reservation.setVoyage(voyage);
            reservation.setNbrePassagers(nbrePassagers);
            reservation.setPrixReservation(Integer.valueOf(voyage.getPrix() * nbrePassagers));
            Reservation result = reservationRepository.save(reservation);

            voyage.setNbrePlace(voyage.getNbrePlace() - nbrePassagers);
            voyageRepository.save(voyage);

            return ResponseEntity.created(new URI("/api/reservations/voyage/" + voyageId + "/"))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                            "\n Reservation reussi !\n consulter votre mail pour activer votre compte "
                                    + customerResult.getEmail().toString()))
                    .body(result);
        }

    }

    /**
     * {@code GET  /reservations} : get all the reservations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of reservations in body.
     */
    @GetMapping("/reservations/customer/voyage/{voyageId}")
    public ResponseEntity<List<Reservation>> getReservationCustomers(Pageable pageable, @PathVariable Long voyageId) {
        log.debug("REST request to get a page of Reservations");
        Page<Reservation> page = reservationRepository.findCustomerByVoyage(pageable, voyageId);

        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
