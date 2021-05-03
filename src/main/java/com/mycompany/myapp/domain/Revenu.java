package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Revenu.
 */
@Entity
@Table(name = "revenu")
public class Revenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "type", nullable = false)
    private String type;

    @NotNull
    @Column(name = "montant", nullable = false)
    private Double montant;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "revenu")
    @JsonIgnoreProperties(value = { "revenu", "depense" }, allowSetters = true)
    private Set<Agence> agences = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Revenu id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Revenu date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getType() {
        return this.type;
    }

    public Revenu type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getMontant() {
        return this.montant;
    }

    public Revenu montant(Double montant) {
        this.montant = montant;
        return this;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public String getDescription() {
        return this.description;
    }

    public Revenu description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Agence> getAgences() {
        return this.agences;
    }

    public Revenu agences(Set<Agence> agences) {
        this.setAgences(agences);
        return this;
    }

    public Revenu addAgence(Agence agence) {
        this.agences.add(agence);
        agence.setRevenu(this);
        return this;
    }

    public Revenu removeAgence(Agence agence) {
        this.agences.remove(agence);
        agence.setRevenu(null);
        return this;
    }

    public void setAgences(Set<Agence> agences) {
        if (this.agences != null) {
            this.agences.forEach(i -> i.setRevenu(null));
        }
        if (agences != null) {
            agences.forEach(i -> i.setRevenu(this));
        }
        this.agences = agences;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Revenu)) {
            return false;
        }
        return id != null && id.equals(((Revenu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Revenu{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", type='" + getType() + "'" +
            ", montant=" + getMontant() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
