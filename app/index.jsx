import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) router.replace("/login");
            setUser(u);
            setLoading(false);
        });
        return unsub;
    }, []);

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
                <Text style={styles.welcome}>Mirë se erdhe!</Text>
                <Text style={styles.subtitle}>Është mirë të të shohim përsëri</Text>
            </View>

            <View style={styles.profileCard}>
                {user?.photoURL && (
                    <Image
                        source={{ uri: user.photoURL }}
                        style={styles.avatar}
                    />
                )}

                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.displayName || "Përdorues"}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
            </View>

        

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={async () => {
                    await signOut(auth);
                    router.replace("/login");
                }}
            >
                <Text style={styles.logoutButtonText}>Çkyçu</Text>
            </TouchableOpacity>
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
        paddingTop: 60
    },
    header: {
        alignItems: "center",
        marginBottom: 40
    },
    welcome: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0A2463",
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: "#1E1B18"
    },
    profileCard: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 30
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16
    },
    userInfo: {
        flex: 1
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0A2463",
        marginBottom: 4
    },
    userEmail: {
        fontSize: 14,
        color: "#1E1B18"
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statItem: {
        flex: 1,
        alignItems: "center"
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#D8315B",
        marginBottom: 4
    },
    statLabel: {
        fontSize: 14,
        color: "#1E1B18"
    },
    statDivider: {
        width: 1,
        backgroundColor: "#E5E5E5",
        marginHorizontal: 10
    },
    logoutButton: {
        backgroundColor: "#D8315B",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
});