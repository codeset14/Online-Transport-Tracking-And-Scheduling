import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Button({ title, onPress, color }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || COLORS.primary }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
