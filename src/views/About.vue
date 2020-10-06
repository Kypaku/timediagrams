<template>
    <div class="about mt-5">
        <v-container>
            <p>
                This is info page for KyDiagrams application.
                The app was created to demonstrate possibilities of Vue.js and Typesctipt in creating SPA applications.
            </p>
            <h3>Vue.js</h3>
            <p>
                Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.
                One of the greatest modern frameworks it conviniet for developing web apps ranging from the simple to the complex.
            </p>
            <h3>TypeScript</h3>
            <p>
                TypeScript is an open-source language which builds on JavaScript, one of the world’s most used tools, by adding static type definitions.
                Types provide a way to describe the shape of an object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.
            </p>
            <p>
                I am going to update the application and implement new features. The purpose is turning the app to completed service.
            </p>
            <p>Andrey Kypaku</p>
            <p>kypaku@mail.ru</p>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'About',
        components: {
        },
    };
</script>

<style lang="scss" scoped>
	.about{
		color: #333;
	}
</style>
