import { View, StyleSheet } from 'react-native';
import { Searchbar, SegmentedButtons, useTheme } from 'react-native-paper';
import { SPACING } from '../constants/theme';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: { label: string; value: string }[];
}

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
}: FilterBarProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Cari data..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.dark
              ? 'rgba(30, 41, 59, 0.7)'
              : theme.colors.elevation.level1,
          },
        ]}
        inputStyle={styles.searchInput}
        iconColor={theme.colors.onSurfaceVariant}
      />
      <SegmentedButtons
        value={filterValue}
        onValueChange={onFilterChange}
        buttons={filterOptions}
        density="small"
        style={styles.segments}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  searchInput: {
    fontSize: 14,
  },
  segments: {
    marginTop: SPACING.xs,
  },
});
