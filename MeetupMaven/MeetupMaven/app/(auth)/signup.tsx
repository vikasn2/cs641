import * as React from 'react'
import { useRouter, Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useSignUp } from '@clerk/clerk-expo'


export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/(home)')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
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
            {!pendingVerification && (
              <>
                <TextInput 
                  placeholder="Email" 
                  style={styles.input} 
                  placeholderTextColor="#aaa"
                  value={emailAddress}
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  />
                  <TextInput
                    placeholder="Password"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                  />
                  <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={(confirmPassword) =>
                      setConfirmPassword(confirmPassword)
                    }
                  />
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                  <Pressable style={styles.signupButtonContainer} onPress={onSignUpPress}>
                    <Text style={styles.signupButton}>Sign Up</Text>
                  </Pressable>
              </> 
            )}
            {pendingVerification && (
                <>
                  <TextInput 
                    value={code} 
                    style={styles.input} 
                    placeholder="Enter the verification code" 
                    onChangeText={(code) => setCode(code)} 
                  />
                  <Pressable style={styles.signupButtonContainer} onPress={onPressVerify}>
                    <Text style={styles.signupButton}>Verify Email</Text>
                  </Pressable>
                </>       
            )}
            <Link href="/(auth)" asChild>
              <Pressable>
                <Text style={styles.link}>Already have an account? Login</Text>
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
  signupButtonContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    marginBottom: 15,
    height: 40,
    justifyContent: "center",
  },
  signupButton: {
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
  },
});
