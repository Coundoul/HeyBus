package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Arret.
 */
@Entity
@Table(name = "arret")
public class Arret implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description")
    private String description;

    @JsonIgnoreProperties(value = { "departs", "arrives", "nomarret", "pays" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Ville nomarretVille;

    @ManyToMany(mappedBy = "arrets")
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Set<Voyage> voyages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Arret id(Long id) {
        this.id = id;
        return this;
    }

    public String getDescription() {
        return this.description;
    }

    public Arret description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Ville getNomarretVille() {
        return this.nomarretVille;
    }

    public Arret nomarretVille(Ville ville) {
        this.setNomarretVille(ville);
        return this;
    }

    public void setNomarretVille(Ville ville) {
        this.nomarretVille = ville;
    }

    public Set<Voyage> getVoyages() {
        return this.voyages;
    }

    public Arret voyages(Set<Voyage> voyages) {
        this.setVoyages(voyages);
        return this;
    }

    public Arret addVoyage(Voyage voyage) {
        this.voyages.add(voyage);
        voyage.getArrets().add(this);
        return this;
    }

    public Arret removeVoyage(Voyage voyage) {
        this.voyages.remove(voyage);
        voyage.getArrets().remove(this);
        return this;
    }

    public void setVoyages(Set<Voyage> voyages) {
        if (this.voyages != null) {
            this.voyages.forEach(i -> i.removeArret(this));
        }
        if (voyages != null) {
            voyages.forEach(i -> i.addArret(this));
        }
        this.voyages = voyages;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Arret)) {
            return false;
        }
        return id != null && id.equals(((Arret) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Arret{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
