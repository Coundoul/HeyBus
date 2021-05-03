package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_de_reservation")
    private LocalDate dateDeReservation;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Voyage voyage;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "reservations" }, allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reservation id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDateDeReservation() {
        return this.dateDeReservation;
    }

    public Reservation dateDeReservation(LocalDate dateDeReservation) {
        this.dateDeReservation = dateDeReservation;
        return this;
    }

    public void setDateDeReservation(LocalDate dateDeReservation) {
        this.dateDeReservation = dateDeReservation;
    }

    public Voyage getVoyage() {
        return this.voyage;
    }

    public Reservation voyage(Voyage voyage) {
        this.setVoyage(voyage);
        return this;
    }

    public void setVoyage(Voyage voyage) {
        this.voyage = voyage;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public Reservation customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reservation)) {
            return false;
        }
        return id != null && id.equals(((Reservation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", dateDeReservation='" + getDateDeReservation() + "'" +
            "}";
    }
}
