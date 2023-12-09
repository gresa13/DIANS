package com.example.homework2.exceptions;

public class WineryAlreadyExistsException extends RuntimeException{
    public WineryAlreadyExistsException() {
        super("Winery already exists");
    }
}
