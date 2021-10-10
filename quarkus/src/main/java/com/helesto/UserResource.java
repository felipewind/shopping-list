package com.helesto;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("users")
@RequestScoped
@Produces("application/json")
@Consumes("application/json")
@Tag(name = "Users")
public class UserResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserResource.class.getName());

    @Inject
    TokenService tokenService;

    @Path("/login")
    @Operation(summary = "Authenticate user")
    @POST
    public Response login(User user) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();

        String jsonString = mapper.writeValueAsString(user);

        LOG.debug("Request: " + jsonString);

        if (user.userName == null || "".equals(user.userName)) {
            throw new WebApplicationException("UserName was invalidly set on request.", 422);
        }

        if (user.password == null || "".equals(user.password)) {
            throw new WebApplicationException("UserName was invalidly set on request.", 422);
        }

        User entity = User.findById(user.userName);

        if (entity == null) {
            throw new WebApplicationException("UserName does not exist.", 404);
        }

        if (!entity.password.equals(user.password)) {
            throw new WebApplicationException("Wrong UserName or Password.", 401);
        }

        String token = tokenService.generateToken(user.userName);

        Map<String, String> tokenMap = new HashMap<>();

        tokenMap.put("jwt", token);

        return Response.ok().status(200).entity(tokenMap).build();
    }

    @Operation(summary = "Create user")
    @Transactional
    @POST
    public Response create(User user, @Context UriInfo uriInfo) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();

        String jsonString = mapper.writeValueAsString(user);

        LOG.debug("Request: " + jsonString);

        if (user.userName == null || "".equals(user.userName)) {
            throw new WebApplicationException("UserName was invalidly set on request.", 422);
        }

        if (user.password == null || "".equals(user.password)) {
            throw new WebApplicationException("UserName was invalidly set on request.", 422);
        }

        User entity = User.findById(user.userName);

        if (entity != null) {
            throw new WebApplicationException("UserName already exists.", 409);
        }

        user.persist();

        URI location = uriInfo.getAbsolutePathBuilder().path(user.userName).build();

        return Response.created(location).build();
    }

    @Operation(summary = "Verify if user name is already taken")
    @APIResponse(responseCode = "200", description = "User is taken", content = {
            @Content(mediaType = "application/json", schema = @Schema(implementation = HashMap.class)) })
    @Path("exist/{userName}")
    @GET
    public Response checkUserNameTaken(@PathParam("userName") String userName) throws JsonProcessingException {

        LOG.debug("Request: " + userName);

        User entity = User.findById(userName.toLowerCase());

        Map<String, Boolean> userTaken = new HashMap<>();

        userTaken.put("isTaken", entity != null);

        return Response.ok(userTaken).build();
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
