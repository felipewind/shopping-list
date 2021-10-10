package com.helesto;

import java.net.URI;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.TimeZone;

import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeIn;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("users/{userName}/shoppings/{shoppingName}/products")
@RequestScoped
@Produces("application/json")
@Consumes("application/json")
@Tag(name = "Products")
@SecurityScheme(securitySchemeName = "Authentication",
    description = "JWT token",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER)
    @RolesAllowed({ "User", "Admin" })
public class ProductResource {

    @Inject
    JsonWebToken jwt;

    @Inject
    @Claim(standard = Claims.upn)
    String userClaim;

    private static final Logger LOG = LoggerFactory.getLogger(ProductResource.class.getName());

    @GET
    @SecurityRequirement(name = "Authentication")
    public List<Product> getByUserName(
        @PathParam("userName") String userName, 
        @PathParam("shoppingName") String shoppingName, 
        @Context SecurityContext ctx) {

        checkUserToken(userName);

        LOG.debug("Expiration time of jwt " + LocalDateTime.ofInstant(Instant.ofEpochSecond(jwt.getExpirationTime()), 
        TimeZone.getDefault().toZoneId()));
        
        return Product.listByUserNameAndShoppingName(userName, shoppingName);
    }

    @GET
    @SecurityRequirement(name = "Authentication")
    @Path("{productName}")
    public Product getSingle(
        @PathParam("userName") String userName, 
        @PathParam("shoppingName") String shoppingName, 
        @PathParam("productName") String productName) {

        checkUserToken(userName);

        Product entity = Product.findByPrimaryKey(userName, shoppingName, productName);

        if (entity == null) {
            throw new WebApplicationException("Product with name " + productName + " does not exist.", 404);
        }

        return entity;
    }

    @POST
    @SecurityRequirement(name = "Authentication")
    @Transactional
    public Response create(
        @PathParam("userName") String userName, 
        @PathParam("shoppingName") String shoppingName,         
        Product product, 
        @Context UriInfo uriInfo) {

        checkUserToken(userName);

        if (product.productName == null || "".equals(product.productName)) {
            throw new WebApplicationException("Product name was invalidly set on request.", 422);
        }

        Product entity = Product.findByPrimaryKey(userName, shoppingName, product.productName);

        if (entity!=null) {
            throw new WebApplicationException("Product name already exists.", 409);
        }

        product.userName = userName;
        product.shoppingName = shoppingName;

        product.persist();

        URI location = uriInfo.getAbsolutePathBuilder().path(product.productName).build();

        return Response.created(location).entity(product).build();

    }

    @PUT
    @SecurityRequirement(name = "Authentication")
    @Path("{productName}")
    @Transactional
    public Product update(
        @PathParam("userName") String userName, 
        @PathParam("shoppingName") String shoppingName, 
        @PathParam("productName") String productName, 
        Product product) {

        checkUserToken(userName);

        if (productName == null || "".equals(productName)) {
            throw new WebApplicationException("Product Name was not set on request.", 422);
        }

        Product entity = Product.findByPrimaryKey(userName, shoppingName, productName);

        if (entity == null) {
            throw new WebApplicationException("Product with name " + productName + 
                " and shopping name " + shoppingName + " does not exist.", 404);
        }

        entity.quantity = product.quantity;
        entity.checked = product.checked;

        return entity;
    }

    @DELETE
    @SecurityRequirement(name = "Authentication")
    @Path("{productName}")
    @Transactional
    public Response delete(
        @PathParam("userName") String userName, 
        @PathParam("shoppingName") String shoppingName, 
        @PathParam("productName") String productName) {

        checkUserToken(userName);

        Product entity = Product.findByPrimaryKey(userName, shoppingName, productName);

        if (entity == null) {
            throw new WebApplicationException("Product with name " + productName + 
                " and shopping name " + shoppingName + " does not exist.", 404);
        }

        entity.delete();
        return Response.status(204).build();
    }

    private void checkUserToken(String userName) {
        if(!userClaim.equals(userName)) {
            throw new WebApplicationException(401);
        }
    }

    @Provider
    public static class ErrorMapper implements ExceptionMapper<Exception> {

        @Inject
        ObjectMapper objectMapper;

        @Override
        public Response toResponse(Exception exception) {
            LOG.error("Failed to handle request", exception);

            int code = 500;
            if (exception instanceof WebApplicationException) {
                code = ((WebApplicationException) exception).getResponse().getStatus();
            }

            ObjectNode exceptionJson = objectMapper.createObjectNode();
            exceptionJson.put("exceptionType", exception.getClass().getName());
            exceptionJson.put("code", code);

            if (exception.getMessage() != null) {
                exceptionJson.put("error", exception.getMessage());
            }

            return Response.status(code).entity(exceptionJson).build();
        }

    }
}
