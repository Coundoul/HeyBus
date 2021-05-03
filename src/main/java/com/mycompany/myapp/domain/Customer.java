package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @NotNull
    @Column(name = "telephone", nullable = false, unique = true)
    private String telephone;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "profession")
    private String profession;

    @Column(name = "datenaissance")
    private LocalDate datenaissance;

    @Column(name = "dateprisecontact")
    private LocalDate dateprisecontact;

    @Column(name = "adresse")
    private String adresse;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties(value = { "voyage", "customer" }, allowSetters = true)
    private Set<Reservation> reservations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Customer nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Customer prenom(String prenom) {
        this.prenom = prenom;
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Customer telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return this.email;
    }

    public Customer email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfession() {
        return this.profession;
    }

    public Customer profession(String profession) {
        this.profession = profession;
        return this;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public LocalDate getDatenaissance() {
        return this.datenaissance;
    }

    public Customer datenaissance(LocalDate datenaissance) {
        this.datenaissance = datenaissance;
        return this;
    }

    public void setDatenaissance(LocalDate datenaissance) {
        this.datenaissance = datenaissance;
    }

    public LocalDate getDateprisecontact() {
        return this.dateprisecontact;
    }

    public Customer dateprisecontact(LocalDate dateprisecontact) {
        this.dateprisecontact = dateprisecontact;
        return this;
    }

    public void setDateprisecontact(LocalDate dateprisecontact) {
        this.dateprisecontact = dateprisecontact;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Customer adresse(String adresse) {
        this.adresse = adresse;
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public User getUser() {
        return this.user;
    }

    public Customer user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Reservation> getReservations() {
        return this.reservations;
    }

    public Customer reservations(Set<Reservation> reservations) {
        this.setReservations(reservations);
        return this;
    }

    public Customer addReservation(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.setCustomer(this);
        return this;
    }

    public Customer removeReservation(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.setCustomer(null);
        return this;
    }

    public void setReservations(Set<Reservation> reservations) {
        if (this.reservations != null) {
            this.reservations.forEach(i -> i.setCustomer(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setCustomer(this));
        }
        this.reservations = reservations;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", email='" + getEmail() + "'" +
            ", profession='" + getProfession() + "'" +
            ", datenaissance='" + getDatenaissance() + "'" +
            ", dateprisecontact='" + getDateprisecontact() + "'" +
            ", adresse='" + getAdresse() + "'" +
            "}";
    }
}
