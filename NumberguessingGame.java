import java.util.Random;
import java.util.Scanner;



public class NumberguessingGame {
    public static void main(String args[]){
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        int maxRange = 100;
        int numberToGuess = random.nextInt(maxRange)+1;
        int numberofTries = 0;
        boolean hasGuessedCorrectly = false;

        System.out.println("Welcome to the number Guessing Game");
        System.out.println("I have picked a number between 1 and "+ maxRange+ " . Try to guess it!");
        while(!hasGuessedCorrectly) {
            System.out.println("Enter  your guess: ");
            int playerGuess = scanner.nextInt();
            numberofTries++;

            if( playerGuess < numberToGuess){
                System.out.println("Too low! Try again.");
            }
            else if(playerGuess > numberToGuess){
                System.out.println("Too high! Try again");
            }else{
                hasGuessedCorrectly = true;
                System.out.println("Congratulations! you guessed the number in " + numberofTries + "tries.");

            }

        }


        scanner.close();
    }
    
}
