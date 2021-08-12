package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ArretTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Arret.class);
        Arret arret1 = new Arret();
        arret1.setId(1L);
        Arret arret2 = new Arret();
        arret2.setId(arret1.getId());
        assertThat(arret1).isEqualTo(arret2);
        arret2.setId(2L);
        assertThat(arret1).isNotEqualTo(arret2);
        arret1.setId(null);
        assertThat(arret1).isNotEqualTo(arret2);
    }
}
