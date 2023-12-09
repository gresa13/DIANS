package com.example.homework2.exceptions;

public class WineryNotFoundException extends RuntimeException{
    public WineryNotFoundException() {
        super("Winery not found");
    }
}
