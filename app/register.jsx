import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../firebase";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);
    };

    const handleRegister = async () => {
        if (!email || !password) {
            return showMessage("Plotëso emailin dhe fjalëkalimin.", "error");
        }

        if (password.length < 6) {
            return showMessage("Fjalëkalimi duhet të jetë së paku 6 karaktere.", "error");
        }

        setLoading(true);
        setMessage("");
        try {
            console.log("Attempting registration with:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Registration successful:", userCredential.user.email);
            showMessage("Llogaria u krijua me sukses!", "success");
            setTimeout(() => {
                router.replace("/");
            }, 1500);
        } catch (error) {
            console.error("Register Error:", error);
            let errorMessage = "Gabim në regjistrim. Provo përsëri.";

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Ky email është tashmë në përdorim.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Email i pavlefshëm.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Fjalëkalimi është shumë i dobët.";
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = "Regjistrimi me email nuk është i aktivizuar.";
            }

            showMessage(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3E92CC" />
                <Text style={styles.loadingText}>Duke krijuar llogarinë...</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Krijo Llogari</Text>
                <Text style={styles.subtitle}>Regjistrohu për të filluar</Text>
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
                    placeholder="Fjalëkalimi (min 6 karaktere)"
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
                    style={[styles.primaryButton, loading && styles.disabledButton]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Regjistrohu</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Ke tashmë llogari? </Text>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Text style={styles.footerLink}>Kyçu</Text>
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