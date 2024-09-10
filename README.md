# autocomplete-dropdown

A Web Component to progressively enhance an HTML select element into a text search box.

Inspired and built upon [this article from Adam Silver](https://adamsilver.io/blog/building-an-accessible-autocomplete-control/)

Implemented in pure JavaScript, zero dependencies, maintains and updates the original select element to ensure a form submit is non the wiser. To the server / form handler, it looks like you're still using the select element. To the user / screen reader you're using the enhanced search box.

## Customisation

It's possible to customise the autocomplete in two main ways:

### Visually

The component exposes a series of CSS Custom Properties as a kind of "style API" allowing you to wire in your own styles to fit your project / branding.

```
/* target the web component in your CSS and override its CSS Custom Properties */
autocomplete-dropdown {
	--list-border-top-left-radius: 0px;
    	--list-border-top-right-radius: 0px;
    	--list-border-bottom-left-radius: 0px;
    	--list-border-bottom-right-radius: 0px;
    	--list-border-color: black;
    	--list-background-color: white;

	--option-highlight-background-color: darkslategray;
    	--option-highlight-border-color: darkslategray;
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

It's also possible to add associative search terms and words to a result, for example you can add a `data-alt-name` attribute to the option element to add alternative search terms.

```
<select name="favourite_car">
  <option value="bmw" data-alt-name="beemer beamer bimmer">BMW</option>
  ...
</select>
```


