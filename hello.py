def greet(name):
    print(f"Hello, {name}!")

def menu():
    while True:
        print("\n--- Menu ---")
        print("1. Greet someone")
        print("2. Say hello to the world")
        print("3. Quit")

        choice = input("\nEnter your choice (1-3): ").strip()

        if choice == "1":
            name = input("Enter a name: ").strip()
            greet(name if name else "stranger")
        elif choice == "2":
            greet("World")
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Invalid choice, please try again.")

if __name__ == "__main__":
    menu()
