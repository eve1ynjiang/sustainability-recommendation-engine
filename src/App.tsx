import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { UploadPage } from './components/UploadPage';

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if this is the user's first time
    const checkFirstTimeUser = async () => {
      if (!user) return;
      
      try {
        // Use local storage to check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem(`onboarding-${user.userId}`);
        
        if (!hasCompletedOnboarding) {
          setIsFirstTimeUser(true);
        } else {
          setIsFirstTimeUser(false);
        }
      } catch (error) {
        console.error('Error checking first time user:', error);
        setIsFirstTimeUser(false); // Default to false if there's an error
      }
    };
    
    checkFirstTimeUser();
  }, [user]);

  useEffect(() => {
    if (isFirstTimeUser === false) {
      // Only load todos if not a first-time user
      client.models.Todo.observeQuery().subscribe({
        next: (data) => setTodos([...data.items]),
      });
    }
  }, [isFirstTimeUser]);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }
  
  function handleUploadComplete() {
    // Mark user as having completed onboarding
    if (user) {
      localStorage.setItem(`onboarding-${user.userId}`, 'true');
      setIsFirstTimeUser(false);
    }
  }

  // Show loading state while checking if user is first-time
  if (isFirstTimeUser === null) {
    return <div>Loading...</div>;
  }
  
  // Show upload page for first-time users
  if (isFirstTimeUser) {
    return <UploadPage onComplete={handleUploadComplete} />;
  }
  
  // Show regular app for returning users
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s sustainability dashboard</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)} 
            key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
