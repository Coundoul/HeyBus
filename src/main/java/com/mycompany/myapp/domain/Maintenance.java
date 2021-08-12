package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Maintenance.
 */
@Entity
@Table(name = "maintenance")
public class Maintenance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "type")
    private String type;

    @Column(name = "nbre_km_moteur")
    private Integer nbreKmMoteur;

    @ManyToOne
    @JsonIgnoreProperties(value = { "fuels", "incidents", "maintenances", "voyages", "transporteur" }, allowSetters = true)
    private Vehicule vehicule;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Maintenance id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Maintenance date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getType() {
        return this.type;
    }

    public Maintenance type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getNbreKmMoteur() {
        return this.nbreKmMoteur;
    }

    public Maintenance nbreKmMoteur(Integer nbreKmMoteur) {
        this.nbreKmMoteur = nbreKmMoteur;
        return this;
    }

    public void setNbreKmMoteur(Integer nbreKmMoteur) {
        this.nbreKmMoteur = nbreKmMoteur;
    }

    public Vehicule getVehicule() {
        return this.vehicule;
    }

    public Maintenance vehicule(Vehicule vehicule) {
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
        if (!(o instanceof Maintenance)) {
            return false;
        }
        return id != null && id.equals(((Maintenance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Maintenance{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", type='" + getType() + "'" +
            ", nbreKmMoteur=" + getNbreKmMoteur() +
            "}";
    }
}
