package com.helesto;

import java.util.Arrays;
import java.util.HashSet;

import javax.enterprise.context.RequestScoped;

import org.eclipse.microprofile.jwt.Claims;

import io.smallrye.jwt.build.Jwt;

@RequestScoped
public class TokenService {
    /**
     * Generate JWT token
     */
    public String generateToken(String userName) {
        String token = Jwt.issuer("https://com.test").upn(userName)
                .groups(new HashSet<>(Arrays.asList("User", "Admin")))
                .claim(Claims.birthdate.name(), "1983-03-25")
                .claim("email", "teste@gmail.com")
                .claim("id", "1234")
                .expiresIn(7200)
                .sign();

        return token;
    }
}
