package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Section.
 */
@Entity
@Table(name = "section")
public class Section implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "description")
    private String description;

    @Column(name = "reference", unique = true)
    private String reference;

    @Column(name = "niveau")
    private String niveau;

    @OneToMany(mappedBy = "section")
    @JsonIgnoreProperties(value = { "employes", "section" }, allowSetters = true)
    private Set<Position> positions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Section id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Section nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Section description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReference() {
        return this.reference;
    }

    public Section reference(String reference) {
        this.reference = reference;
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getNiveau() {
        return this.niveau;
    }

    public Section niveau(String niveau) {
        this.niveau = niveau;
        return this;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public Set<Position> getPositions() {
        return this.positions;
    }

    public Section positions(Set<Position> positions) {
        this.setPositions(positions);
        return this;
    }

    public Section addPosition(Position position) {
        this.positions.add(position);
        position.setSection(this);
        return this;
    }

    public Section removePosition(Position position) {
        this.positions.remove(position);
        position.setSection(null);
        return this;
    }

    public void setPositions(Set<Position> positions) {
        if (this.positions != null) {
            this.positions.forEach(i -> i.setSection(null));
        }
        if (positions != null) {
            positions.forEach(i -> i.setSection(this));
        }
        this.positions = positions;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Section)) {
            return false;
        }
        return id != null && id.equals(((Section) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Section{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", reference='" + getReference() + "'" +
            ", niveau='" + getNiveau() + "'" +
            "}";
    }
}
