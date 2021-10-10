package com.helesto;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.panache.common.Parameters;
import io.quarkus.panache.common.Sort;

@Entity
@Table(name = "SHOPPING")
@IdClass(Shopping.ShoppingPrimaryKey.class)
public class Shopping extends PanacheEntityBase {

    public static class ShoppingPrimaryKey implements Serializable {
        public String userName;
        public String shoppingName;
    }

    @Id
    @Column(length = 20)
    public String userName;

    @Id
    @Column(length = 40)
    public String shoppingName;

    public static List<Shopping> listByUserName(String userName) {
        return list("userName", Sort.by("userName"), userName);
    }

    public static Shopping findByUserAndShoppingName(String userName, String shoppingName) {
        return find("userName = :userName " + " AND shoppingName =  :shoppingName",
                Parameters.with("userName", userName.toLowerCase().trim()).and("shoppingName", shoppingName.toLowerCase().trim()))
                        .firstResult();
    }

    public static long deleteByUserAndShoppingName(String userName, String shoppingName) {
        return delete("userName = :userName " + " AND shoppingName =  :shoppingName",
                Parameters.with("userName", userName.toLowerCase().trim()).and("shoppingName", shoppingName.toLowerCase().trim()));
    }

    public void setUserName(String userName) {
        this.userName = userName.toLowerCase().trim();
    }

    public void setShoppingName(String shoppingName) {
        this.shoppingName = shoppingName.toLowerCase().trim();
    }

}
