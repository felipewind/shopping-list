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
@Table(name = "PRODUCT")
@IdClass(Product.ProductPrimaryKey.class)
public class Product extends PanacheEntityBase {

    public static class ProductPrimaryKey implements Serializable {
        public String userName;
        public String shoppingName;
        public String productName;
    }

    @Id
    @Column(length = 20)
    public String userName;

    @Id
    @Column(length = 40)
    public String shoppingName;

    @Id
    @Column(length = 40)
    public String productName;

    public int quantity;

    public boolean checked;

    public static List<Product> listByUserNameAndShoppingName(String userName, String shoppingName) {

        return list("userName = :userName " + " AND shoppingName = :shoppingName",
                Sort.by("checked").and("productName"),
                Parameters.with("userName", userName.toLowerCase()).and("shoppingName", shoppingName.toLowerCase()));

    }

    public static Product findByPrimaryKey(String userName, String shoppingName, String productName) {
        return find("userName = :userName " + " AND shoppingName = :shoppingName" + " AND productName =  :productName",
                Parameters.with("userName", userName.toLowerCase().trim()).and("shoppingName", shoppingName.toLowerCase().trim())
                        .and("productName", productName.toLowerCase().trim())).firstResult();
    }

    public static int updateShoppingName(String userName, String oldShoppingName, String newShoppingName) {
        return update(
                "SET shoppingName = :newShoppingName " + " WHERE userName = :userName "
                        + " AND shoppingName = :oldShoppingName",
                Parameters.with("userName", userName.toLowerCase())
                        .and("oldShoppingName", oldShoppingName.toLowerCase().trim())
                        .and("newShoppingName", newShoppingName.toLowerCase().trim()));
    }

    public static long deleteByUserNameAndShoppingName(String userName, String shoppingName) {
        return delete("userName = :userName " + " AND shoppingName = :shoppingName",
                Parameters.with("userName", userName.toLowerCase().trim()).and("shoppingName", shoppingName.toLowerCase().trim()));
    }

    public void setUserName(String userName) {
        this.userName = userName.toLowerCase().trim();
    }

    public void setProductName(String productName) {
        this.productName = productName.toLowerCase().trim();
    }

}
