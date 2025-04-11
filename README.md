# &lt;autocomplete-dropdown&gt;

A Web Component to progressively enhance an HTML select element into a text search box.

Inspired and built upon [this article from Adam Silver](https://adamsilver.io/blog/building-an-accessible-autocomplete-control/)

Implemented in pure JavaScript with zero dependencies, it maintains and updates the original select element to ensure form submissions remain unaffected. To the server or form handler, it appears as if you're still using the select element, while to the user or screen reader, it's an enhanced search box.

## Demo

[https://jasongorman.uk/demos/autocomplete-dropdown/](https://jasongorman.uk/demos/autocomplete-dropdown/)

## Usage

Include the web components JS file in your page and wrap `<autocomplete-dropdown>` around your select element.

```
<autocomplete-dropdown>
    <select name="fruit">
        <option value="strawberry">Strawberry</option>
        ...
    </select>
</autocomplete-dropdown>

<script type="module" src="./autocomplete-dropdown-wc.js"></script>
```


## Customisation

It's possible to customise the autocomplete in two main ways:

### Style API

The component exposes a series of CSS Custom Properties as its style API, allowing you to hook up your own styles to fit your project / branding.

```
/* target the web component in your CSS and override its CSS Custom Properties */
autocomplete-dropdown {
    --list-border-top-left-radius: 0px;
    --list-border-top-right-radius: 0px;
    --list-border-bottom-left-radius: 0px;
    --list-border-bottom-right-radius: 0px;
    --list-border-color: black;
    --list-background-color: white;

    --option-highlight-background-color: darkslategray;--option-highlight-border-color: darkslategray;
    --option-highlight-text-color: white;

    --input-border-top-left-radius: 0px;
    --input-border-top-right-radius: 0px;
    --input-border-bottom-left-radius: 0px;
    --input-border-bottom-right-radius: 0px;
    --input-border-color: black;
    --input-border-width: 2px;
    --input-text-color: black;

    --font-family: arial, sans-serif;
}
```

### Alternative search terms

Add alternative search terms and words associated to a result, add a `data-alt-name` attribute to the `<option>` element to apply its alternative search terms.

```
<autocomplete-dropdown>
    <select name="car">
        <option value="bmw" data-alt-name="beemer beamer bimmer">BMW</option>
        ...
    </select>
</autocomplete-dropdown>

<script type="module" src="./autocomplete-dropdown-wc.js"></script>
```

### Stress testing

I've tried the component with 3000 option elements, it may be possible to push to 4000 or even 5000 but it will depend on the device rendering the page. If you have even more options another solution would be best.
