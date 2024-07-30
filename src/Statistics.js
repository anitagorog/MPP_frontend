import React, { useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const Statistics = ({ filteredList }) => {
    // Count the occurrences of each age
    const ageCounts = filteredList.reduce((counts, profile) => {
        counts[profile.age] = (counts[profile.age] || 0) + 1;
        return counts;
    }, {});

    useEffect(() => {
        console.log('ITT')
        // console.log(filteredList);
    }, [])

    // Extract unique ages
    const uniqueAges = Object.keys(ageCounts);

    // Prepare data for BarChart component
    const data = uniqueAges.map(age => ({ age: parseInt(age), count: ageCounts[age] }));

    // Render nothing if filteredList is empty
    if (filteredList.length === 0) {
        return null;
    }

    return (
        <div>
            <header>Statistics</header>
            <BarChart
                series={[{ data: data.map(({ count }) => count) }]}
                //series={[{ data:[] }]}
                height={200}
                width={300}
                xAxis={[{ data: data.map(({ age }) => age), scaleType: 'band' }]}
                //xAxis={[{ data: [], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
        </div>
    );
}

export default Statistics;
