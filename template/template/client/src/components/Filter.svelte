<script>
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let filters = {
        color: "",
        price: "",
        type: "",
    };

    const applyFilters = () => {
        dispatch('change');
    };
</script>

<aside class="filter-bar">
    <h3>Filters</h3>
    <label>
        Color:
        <select bind:value={filters.color}>
            <option value="">Any</option>
            <option value="multicolor">multicolor</option>
            <option value="blue">blue</option>
            <option value="yellow">yellow</option>
            <option value="purple">purple</option>
            <option value="black">black</option>
            <option value="white">white</option>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="grey">grey</option>
            <option value="metallic">metallic</option>
            <option value="gold">gold</option>
            <option value="brown">brown</option>
        </select>
    </label>
    <label>
        Price:
        <select bind:value={filters.price}>
            <option value="">Any</option>
            <option value="0-1000">€0 - €1000</option>
            <option value="1000-10000">1000 - €10000</option>
            <option value="10000-100000">€10000 - €100000</option>
            <option value="100000-5000000">€100000 - €5000000</option>
            <option value="5000000-25000000">€5000000 - €25000000</option>
            <option value="25000000+">Above €25000000</option>
        </select>
    </label>
    <label>
        Type:
        <select bind:value={filters.type}>
            <option value="">Any</option>
            <option value="painting">painting</option>
            <option value="sculpture">sculpture</option>
            <option value="portrait">portrait</option>
            <option value="digital art">digital art</option>
            <option value="child drawing">child drawing</option>
            <option value="landscape">landscape</option>
        </select>
    </label>
    <button on:click={applyFilters}>Filter</button>
</aside>

<style>
    .filter-bar {
        flex: 1;
        padding: 20px;
        background: rgba(213, 213, 110, 0.4); /* Semi transparent background matching my artworkbox component */
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 20px;
        transition: all 0.3s ease;
    }

    .filter-bar h3 {
        text-align: center;
        margin-bottom: 25px;
        font-size: 22px;
        font-weight: 700;
        color: white;
        text-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff;
    }

    .filter-bar label {
        display: block;
        margin-bottom: 20px;
        color: white;
        text-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff;
    }

    .filter-bar select,
    .filter-bar button {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: none;
        background: rgba(255, 255, 255, 0.3);
        color: white;
        text-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff;
        margin-bottom: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .filter-bar select:hover,
    .filter-bar button:hover {
        background: rgba(255, 255, 255, 0.5);
    }

    .filter-bar select:focus,
    .filter-bar button:focus {
        outline: none;
        box-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff;
    }

    .filter-bar option {
        background: white;
        color: #333;
    }

    .filter-bar button {
        padding: 12px 15px;
        background-color: #cebf00;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .filter-bar button:hover {
        transform: translateY(-3px);
        box-shadow: 0 2px 12px rgba(206, 191, 0, 0.5);
    }

    .filter-bar button:active {
        transform: translateY(1px);
        box-shadow: none;
    }


    @media (max-width: 768px) {
        .filter-bar {
            margin: 10px;
            padding: 15px;
        }
    }

</style>