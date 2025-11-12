import { router } from "expo-router";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.email);
        router.replace("/");
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      return showMessage("Plotëso emailin dhe fjalëkalimin.", "error");
    }

    setLoginLoading(true);
    setMessage("");
    try {
      console.log("Attempting login with:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential.user.email);
      showMessage("Kyçja u krye me sukses!", "success");
      router.replace("/");
    } catch (error) {
      console.error("Login Error:", error);
      let errorMessage = "Gabim në login. Provo përsëri.";

      if (error.code === 'auth/invalid-email') {
        errorMessage = "Email i pavlefshëm.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Kredenciale të pavlefshme.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Shumë tentativa. Provo më vonë.";
      }

      showMessage(errorMessage, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google Login:", result.user.email);
      showMessage("Kyçja me Google u krye me sukses!", "success");
      router.replace("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      showMessage("Gabim në kyçje me Google.", "error");
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3E92CC" />
        <Text style={styles.loadingText}>Duke u ngarkuar...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mirë se erdhe</Text>
        <Text style={styles.subtitle}>Kyçu në llogarinë tënde</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A6A6A6"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Fjalëkalimi"
          placeholderTextColor="#A6A6A6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {message ? (
          <View style={[
            styles.messageContainer,
            messageType === "success" ? styles.successMessage : styles.errorMessage
          ]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.primaryButton, loginLoading && styles.disabledButton]}
          onPress={handleEmailLogin}
          disabled={loginLoading}
        >
          {loginLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Kyçu</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ose</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleButtonText}>Vazhdo me Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Nuk ke llogari? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.footerLink}>Regjistrohu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFAFF"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#1E1B18"
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFAFF",
    paddingHorizontal: 24,
    paddingTop: 80
  },
  header: {
    alignItems: "center",
    marginBottom: 50
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A2463",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#1E1B18"
  },
  form: {
    width: "100%"
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1E1B18"
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  successMessage: {
    backgroundColor: '#E8F5E8',
    borderColor: '#3E92CC',
  },
  errorMessage: {
    backgroundColor: '#FFEBEE',
    borderColor: '#D8315B',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: "#0A2463",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#0A2463",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#A6A6A6",
    shadowColor: "#A6A6A6",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5"
  },
  dividerText: {
    color: "#1E1B18",
    paddingHorizontal: 16
  },
  googleButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 30
  },
  googleButtonText: {
    color: "#1E1B18",
    fontWeight: "600",
    fontSize: 16
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  footerText: {
    color: "#1E1B18",
    fontSize: 15
  },
  footerLink: {
    color: "#3E92CC",
    fontSize: 15,
    fontWeight: "600"
  },
});