import * as React from 'react'
import { Link,useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
 } from "react-native";
import { useSignIn } from '@clerk/clerk-expo'

export default function Login() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(home)')
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      const error = err.errors?.[0]?.message || "An error occurred. Please try again.";
      setErrorMessage(error);
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])
  return (
    <ImageBackground
      source={require("../../assets/Background_Frame.png")}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.5 }}
    >
       <KeyboardAvoidingView
        style={styles.wrapperContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>MeetUpMaven</Text>
            <Text style={styles.subtitle}>
                Your all-in-one platform for seamless event organization and attendee engagement.
            </Text>            
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              placeholderTextColor="#aaa"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              value={emailAddress}  
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              placeholderTextColor="#aaa"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
              value={password}
            />
            <Pressable style={styles.loginButtonContainer} onPress={onSignInPress}>
              <Text style={styles.loginButton}>Login</Text>
            </Pressable>
            <Link href="/signup" asChild>
              <Pressable>
                <Text style={styles.link}>Don't have an account? Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "black",
  },
  wrapperContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 15,
    paddingHorizontal: 5,
    color: "white",
    paddingVertical: 15,
    textAlign: "center",
    width: "85%",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "white",
    color: "black",
  },
  loginButtonContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    marginBottom: 15,
    height: 40,
    justifyContent: "center",
  },
  loginButton: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});