package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Incident.
 */
@Entity
@Table(name = "incident")
public class Incident implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gravite")
    private String gravite;

    @NotNull
    @Column(name = "chauffeur", nullable = false)
    private String chauffeur;

    @NotNull
    @Column(name = "responsableincident", nullable = false)
    private String responsableincident;

    @Column(name = "reporteurincident")
    private String reporteurincident;

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

    public Incident id(Long id) {
        this.id = id;
        return this;
    }

    public String getGravite() {
        return this.gravite;
    }

    public Incident gravite(String gravite) {
        this.gravite = gravite;
        return this;
    }

    public void setGravite(String gravite) {
        this.gravite = gravite;
    }

    public String getChauffeur() {
        return this.chauffeur;
    }

    public Incident chauffeur(String chauffeur) {
        this.chauffeur = chauffeur;
        return this;
    }

    public void setChauffeur(String chauffeur) {
        this.chauffeur = chauffeur;
    }

    public String getResponsableincident() {
        return this.responsableincident;
    }

    public Incident responsableincident(String responsableincident) {
        this.responsableincident = responsableincident;
        return this;
    }

    public void setResponsableincident(String responsableincident) {
        this.responsableincident = responsableincident;
    }

    public String getReporteurincident() {
        return this.reporteurincident;
    }

    public Incident reporteurincident(String reporteurincident) {
        this.reporteurincident = reporteurincident;
        return this;
    }

    public void setReporteurincident(String reporteurincident) {
        this.reporteurincident = reporteurincident;
    }

    public Vehicule getVehicule() {
        return this.vehicule;
    }

    public Incident vehicule(Vehicule vehicule) {
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
        if (!(o instanceof Incident)) {
            return false;
        }
        return id != null && id.equals(((Incident) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Incident{" +
            "id=" + getId() +
            ", gravite='" + getGravite() + "'" +
            ", chauffeur='" + getChauffeur() + "'" +
            ", responsableincident='" + getResponsableincident() + "'" +
            ", reporteurincident='" + getReporteurincident() + "'" +
            "}";
    }
}
