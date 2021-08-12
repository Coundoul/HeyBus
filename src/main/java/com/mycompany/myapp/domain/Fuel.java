package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Fuel.
 */
@Entity
@Table(name = "fuel")
public class Fuel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "type_de_carburant", nullable = false)
    private String typeDeCarburant;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "km", nullable = false)
    private Integer km;

    @NotNull
    @Column(name = "nb_litre", nullable = false)
    private Integer nbLitre;

    @NotNull
    @Column(name = "montant", nullable = false)
    private Double montant;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "fuels", "incidents", "maintenances", "voyages", "transporteur" }, allowSetters = true)
    private Vehicule vehicule;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Fuel id(Long id) {
        this.id = id;
        return this;
    }

    public String getTypeDeCarburant() {
        return this.typeDeCarburant;
    }

    public Fuel typeDeCarburant(String typeDeCarburant) {
        this.typeDeCarburant = typeDeCarburant;
        return this;
    }

    public void setTypeDeCarburant(String typeDeCarburant) {
        this.typeDeCarburant = typeDeCarburant;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Fuel date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getKm() {
        return this.km;
    }

    public Fuel km(Integer km) {
        this.km = km;
        return this;
    }

    public void setKm(Integer km) {
        this.km = km;
    }

    public Integer getNbLitre() {
        return this.nbLitre;
    }

    public Fuel nbLitre(Integer nbLitre) {
        this.nbLitre = nbLitre;
        return this;
    }

    public void setNbLitre(Integer nbLitre) {
        this.nbLitre = nbLitre;
    }

    public Double getMontant() {
        return this.montant;
    }

    public Fuel montant(Double montant) {
        this.montant = montant;
        return this;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public Vehicule getVehicule() {
        return this.vehicule;
    }

    public Fuel vehicule(Vehicule vehicule) {
        this.setVehicule(vehicule);
        return this;
    }

    public void setVehicule(Vehicule vehicule) {
        this.vehicule = vehicule;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fuel)) {
            return false;
        }
        return id != null && id.equals(((Fuel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fuel{" +
            "id=" + getId() +
            ", typeDeCarburant='" + getTypeDeCarburant() + "'" +
            ", date='" + getDate() + "'" +
            ", km=" + getKm() +
            ", nbLitre=" + getNbLitre() +
            ", montant=" + getMontant() +
            "}";
    }
}
