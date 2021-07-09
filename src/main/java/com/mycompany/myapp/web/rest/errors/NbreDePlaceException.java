package com.mycompany.myapp.web.rest.errors;

public class NbreDePlaceException extends BadRequestAlertException {

    private static final long serialVersionUID = 1L;

    public NbreDePlaceException() {
        super(ErrorConstants.NBRE_PLACE_ATTEINT, "Le nombre de place restant est insuffisant!", "Nombre Place", "Nombre Place Insufisant");
    }
}
