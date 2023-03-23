import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { useState } from "react";
import Constants from "expo-constants";

import { Card } from "react-native-paper";

class Di {
    isLocked: boolean;
    _maxVal: number;
    value!: number;

    constructor(maxVal = 6) {
        this.isLocked = false;
        this._maxVal = maxVal;
        this.roll();
    }
    roll() {
        this.value = Math.ceil(Math.random() * this._maxVal);
        return this;
    }
    toggleLocked() {
        this.isLocked = !this.isLocked;
    }
}

type Options = {
    maxVal: 6;
};

const rollDiceArray = (
    dice: Array<Di | undefined> = [],
    options: Options = { maxVal: 6 }
) => {
    return dice.map(diMapper(options));
};

const diMapper = (options: Options) => {
    return (di: Di | undefined) => {
        if (di instanceof Di) {
            return di.isLocked ? di : di.roll();
        } else {
            return new Di(options.maxVal);
        }
    };
};

const initDiceArray = () => rollDiceArray(new Array(10).fill(undefined));

export default function App({ diceLength = 10 }) {
    /**
     * Could also use a map for o(1) win condition instead of o(n) win condition with array, it's just not noticeable in this small app with max 10 dice.
     * Still, array makes updates really easy for a small app, and mitigates complexity in the handleReroll update methods IMO too.
     * ex:
     * diceMap = {
     *  value: Set({diPositionIdx: number; isLocked: boolean;})
     * }
     */
    const [dice, setDice] = useState(initDiceArray());

    const handleToggleLocked = (idx: number) => {
        const diceCopy = [...dice];
        diceCopy[idx].toggleLocked();
        console.log(diceCopy);
        setDice(diceCopy);
    };

    const handleReroll = () => {
        setDice(rollDiceArray(dice));
    };

    const gameIsWon = () => {
        return dice.every((di, _, arr) => di.value === arr[0].value);
    };

    const handlePlayAgain = () => {
        setDice(initDiceArray());
    };

    // const debugForceWin = () => {
    //     const diceCopy = [...dice];
    //     diceCopy.forEach((di) => (di.value = 1));
    //     setDice(diceCopy);
    // };

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                {gameIsWon()
                    ? "You won!"
                    : "Make all ten buttons match to win!"}
            </Text>
            {gameIsWon() && (
                <Button title="play again!" onPress={handlePlayAgain} />
            )}
                {dice?.map((di, idx) => (
                    <LockableDiButton
                        idx={idx}
                        handleToggleLocked={handleToggleLocked}
                        title={di.value.toString()}
                        isLocked={di.isLocked}
                    />
                ))}
            <Button title="reroll" onPress={handleReroll} color="pink" />
     
            {/* <Button title="debug force win" onPress={debugForceWin} /> */}
        </View>
    );
}

function LockableDiButton({
    isLocked,
    handleToggleLocked,
    idx,
    title,
    ...props
}: {
    isLocked: boolean;
    handleToggleLocked: (idx: number) => void;
    idx: number;
    title: string;
}) {
    return (
        <Button
            {...props}
            title={title}
            onPress={() => handleToggleLocked(idx)}
            color={isLocked ? "gray" : "blue"}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1",
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    dice: {
        flex: 1,
        maxWidth: "50%",
        alignItems: "center",
    },
});
