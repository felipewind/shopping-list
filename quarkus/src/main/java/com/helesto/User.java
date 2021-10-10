package com.helesto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

@Entity
@Table(name = "USER_SHOPPING")
public class User extends PanacheEntityBase {

    @Id
    @Column(length = 20)
    public String userName;

    @Column(length = 20)
    public String password;

    public void setUserName(String userName) {
        this.userName = userName.toLowerCase().trim();
    }

}
