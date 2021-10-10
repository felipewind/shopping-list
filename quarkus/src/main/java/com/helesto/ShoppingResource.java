package com.helesto;

import java.net.URI;
import java.util.List;

import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
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

@Path("users/{userName}/shoppings")
@RequestScoped
@Produces("application/json")
@Consumes("application/json")
@Tag(name = "Shoppings")
@SecurityScheme(securitySchemeName = "Authentication",
    description = "JWT token",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER)
    @RolesAllowed({ "User", "Admin" })
public class ShoppingResource {

    @Inject
    JsonWebToken jwt;

    @Inject
    @Claim(standard = Claims.upn)
    String userClaim;

    @Inject
    EntityManager em;

    private static final Logger LOG = LoggerFactory.getLogger(ShoppingResource.class.getName());

    @GET
    @SecurityRequirement(name = "Authentication")
    public List<Shopping> getByUserName(@PathParam("userName") String userName, @Context SecurityContext ctx) {

        checkUserToken(userName);

        return Shopping.listByUserName(userName);
    }

    @GET
    @SecurityRequirement(name = "Authentication")
    @Path("{shoppingName}")
    public Shopping getSingle(@PathParam("userName") String userName, @PathParam("shoppingName") String shoppingName) {

        checkUserToken(userName);

        Shopping entity = Shopping.findByUserAndShoppingName(userName, shoppingName);

        if (entity == null) {
            throw new WebApplicationException("Shopping with name " + shoppingName + " does not exist.", 404);
        }

        return entity;
    }

    @POST
    @SecurityRequirement(name = "Authentication")
    @Transactional
    public Response create(@PathParam("userName") String userName, Shopping shopping, @Context UriInfo uriInfo) {

        checkUserToken(userName);

        if (shopping.shoppingName == null || "".equals(shopping.shoppingName)) {
            throw new WebApplicationException("Shopping name was invalidly set on request.", 422);
        }

        shopping.userName = userName;

        shopping.persist();

        URI location = uriInfo.getAbsolutePathBuilder().path(shopping.shoppingName).build();

        return Response.created(location).entity(shopping).build();

    }

    @PUT
    @SecurityRequirement(name = "Authentication")
    @Path("{shoppingName}")
    @Transactional(rollbackOn = Exception.class)
    public Shopping update(@PathParam("userName") String userName, @PathParam("shoppingName") String oldShoppingName, Shopping shopping) {

        checkUserToken(userName);

        if (oldShoppingName == null || "".equals(oldShoppingName)) {
            throw new WebApplicationException("Shopping Name was not set on request.", 422);
        }

        // Searchs for the existing shoppingName, that will be changed
        Shopping entity = Shopping.findByUserAndShoppingName(userName, oldShoppingName);

        if (entity == null) {
            throw new WebApplicationException("Shopping with name " + oldShoppingName + " to be changed does not exist.", 404);
        }

        em.clear();

        // Verify if the new shoppingName already exists
        entity = Shopping.findByUserAndShoppingName(userName, shopping.shoppingName);

        if (entity != null) {
            throw new WebApplicationException("New shopping with name " + oldShoppingName + " already exist.", 409);
        }

        em.clear();

        // Persist new Shopping
        shopping.userName = userName;        

        shopping.persist();

        // Update Products to the New Shopping
        Product.updateShoppingName(userName, oldShoppingName, shopping.shoppingName);

        // Remove old Shopping
        Shopping.deleteByUserAndShoppingName(userName, oldShoppingName);

        return entity;
    }

    @DELETE
    @SecurityRequirement(name = "Authentication")
    @Path("{shoppingName}")
    @Transactional(rollbackOn = Exception.class)
    public Response delete(@PathParam("userName") String userName, @PathParam("shoppingName") String shoppingName) {

        checkUserToken(userName);

        Shopping entity = Shopping.findByUserAndShoppingName(userName, shoppingName);

        if (entity == null) {
            throw new WebApplicationException("Shopping with name " + shoppingName + " does not exist.", 404);
        }

        Product.deleteByUserNameAndShoppingName(userName, shoppingName);

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
