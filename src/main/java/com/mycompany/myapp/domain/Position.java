package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Position.
 */
@Entity
@Table(name = "position")
public class Position implements Serializable {

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

    @OneToMany(mappedBy = "position")
    @JsonIgnoreProperties(value = { "user", "position", "transporteur", "voyages" }, allowSetters = true)
    private Set<Employe> employes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "positions" }, allowSetters = true)
    private Section section;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Position id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Position nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return this.description;
    }

    public Position description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReference() {
        return this.reference;
    }

    public Position reference(String reference) {
        this.reference = reference;
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getNiveau() {
        return this.niveau;
    }

    public Position niveau(String niveau) {
        this.niveau = niveau;
        return this;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public Set<Employe> getEmployes() {
        return this.employes;
    }

    public Position employes(Set<Employe> employes) {
        this.setEmployes(employes);
        return this;
    }

    public Position addEmploye(Employe employe) {
        this.employes.add(employe);
        employe.setPosition(this);
        return this;
    }

    public Position removeEmploye(Employe employe) {
        this.employes.remove(employe);
        employe.setPosition(null);
        return this;
    }

    public void setEmployes(Set<Employe> employes) {
        if (this.employes != null) {
            this.employes.forEach(i -> i.setPosition(null));
        }
        if (employes != null) {
            employes.forEach(i -> i.setPosition(this));
        }
        this.employes = employes;
    }

    public Section getSection() {
        return this.section;
    }

    public Position section(Section section) {
        this.setSection(section);
        return this;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Position)) {
            return false;
        }
        return id != null && id.equals(((Position) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Position{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", description='" + getDescription() + "'" +
            ", reference='" + getReference() + "'" +
            ", niveau='" + getNiveau() + "'" +
            "}";
    }
}
