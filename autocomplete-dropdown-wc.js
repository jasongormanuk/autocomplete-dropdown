class AutoCompleteDropdown extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        
        this.selectElement = this.querySelector('select');
        this.container = this.shadowRoot;
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('autocomplete');
        this.container.append(this.wrapper);
        
        this.template = document.createElement('template');
        this.template.innerHTML = `
            <li 
                tabindex="-1"
                aria-selected="false"
                role="option"
                data-option-value=""
                id=""
            ></li>
        `;

        const stylesLink = document.createElement('link');
        stylesLink.rel = 'stylesheet';
        stylesLink.href = './autocomplete.css';


        this.container.appendChild(stylesLink);
        
        this.createTextBox();
        this.createMenu();
        this.hideSelectBox();
        this.createStatusBox();
        this.setupKeys();

        document.addEventListener('click', this.onDocumentClick.bind(this));
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed. Old value: ${oldValue}, new value ${newValue}`);
    }


    onDocumentClick(e) {
        if (e.target === this) return;

        this.hideMenu();
        this.removeTextBoxFocus();
    }

    createTextBox() {
        const self = this;
        this.textBox = document.createElement('input');
        this.textBox.classList.add('dropdown');
        this.textBox.setAttribute('autocapitalize', 'none');
        this.textBox.setAttribute('type', 'text');
        this.textBox.setAttribute('autocomplete', 'off');

        this.textBox.setAttribute('aria-owns', this.getOptionsId());
        this.textBox.setAttribute('aria-autocomplete', 'list');
        this.textBox.setAttribute('role', 'combobox');

        const duplicateLabel = document.createElement('label');

        duplicateLabel.innerHTML = this.previousElementSibling.innerHTML;
        duplicateLabel.id = this.previousElementSibling.id;
        duplicateLabel.classList.add('visually-hidden');

        this.textBox.setAttribute('aria-describedby', `${duplicateLabel.id}`);
        this.textBox.id = this.selectElement.id; // ensure the text input is associated to the duplicate label

        duplicateLabel.htmlFor = this.textBox.id; // ensure the duplicate label is associated to the text box

        function handleKeyDown(t) {
            switch (t.keyCode) {
                case this.keys.tab:
                    this.hideMenu();
                    this.removeTextBoxFocus();
                    break;
                default:
            }
        }

        if (this.selectElement.querySelector('option:checked').value.trim().length > 0) {
            this.textBox.value = this.selectElement.querySelector('option:checked').value.trim();
        }

        this.wrapper.appendChild(duplicateLabel);
        this.wrapper.appendChild(this.textBox);

        this.textBox.addEventListener('click', this.onTextBoxClick.bind(this));
        this.textBox.addEventListener('keydown', handleKeyDown.bind(self));
        this.textBox.addEventListener('keyup', this.onTextBoxKeyUp.bind(this));
        this.textBox.addEventListener('focus', this.onTextBoxFocus.bind(this));
    }

    setupKeys() {
        this.keys = {
            enter: 13,
            esc: 27,
            space: 32,
            up: 38,
            down: 40,
            tab: 9,
            left: 37,
            right: 39,
            shift: 16
        };
    }

    onTextBoxFocus(e) {
        if (e.target.value && e.target.value !== '') {
            const filteredOptions = this.getOptions(e.target.value.trim().toLowerCase());

            this.buildMenu(filteredOptions);
            this.showMenu();
            this.updateStatus(filteredOptions.length);
        } else {
            this.hideMenu();
        }
        this.textBox.classList.add('autocomplete-isFocused');
    }

    removeTextBoxFocus() {
        this.hideMenu();
        this.textBox.classList.remove('autocomplete-isFocused');
    }

    onTextBoxClick(e) {
        if (e.target.value && e.target.value !== '') {
            const filteredOptions = this.getOptions(e.target.value.trim().toLowerCase());

            this.buildMenu(filteredOptions);
            this.showMenu();
            this.updateStatus(filteredOptions.length);
        } else {
            this.clearOptions();
            const allOptions = this.getAllOptions();
            this.buildMenu(allOptions);
            this.updateStatus(allOptions.length);
            this.hideMenu();
        }

        if (typeof e.target.select === 'function') {
            e.target.select();
        }
    }

    onTextBoxKeyUp(e) {
        switch (e.keyCode) {
            case this.keys.esc:
            case this.keys.up:
            case this.keys.left:
            case this.keys.right:
            case this.keys.space:
            case this.keys.enter:
            case this.keys.tab:
            case this.keys.shift:
                break;
            case this.keys.down:
                this.onTextBoxDownPressed(e);
                break;
            default:
                this.onTextBoxType(e);
        }
    }

    onMenuKeyDown(e) {
        switch (e.keyCode) {
            case this.keys.up:
                this.onOptionUpArrow(e);
                break;
            case this.keys.down:
                this.onOptionDownArrow(e);
                break;
            case this.keys.enter:
                this.onOptionEnter(e);
                break;
            case this.keys.space:
                this.onOptionSpace(e);
                break;
            case this.keys.esc:
                this.onOptionEscape(e);
                break;
            case this.keys.tab:
                this.hideMenu();
                this.removeTextBoxFocus();
                break;
            default:
                this.textBox.focus();
        }
    }

    onTextBoxType(e) {
        if (e.target.value.trim().length > 0) {
            const filteredOptions = this.getOptions(e.target.value.trim().toLowerCase());

            this.buildMenu(filteredOptions);
            this.showMenu();
            this.updateStatus(filteredOptions.length);
        } else {
            this.hideMenu();
        }
        this.updateSelectBox();
    }

    updateSelectBox() {
        const textBoxContent = this.textBox.textContent.trim();
        const matchingSelectOption = this.getMatchingOption(textBoxContent);
        if (matchingSelectOption) {
            this.selectElement.value = matchingSelectOption.value;
        } else {
            this.selectElement.value = '';
        }
    }

    onOptionEscape() {
        this.clearOptions();
        this.hideMenu();
        this.focusTextBox();
    }

    focusTextBox() {
        this.textBox.focus();
    }

    onOptionEnter(e) {
        if (this.isOptionSelected()) {
            this.selectActiveOption();
            e.preventDefault();
        }
    }

    onOptionSpace(e) {
        if (this.isOptionSelected()) {
            this.selectActiveOption();
            e.preventDefault();
        }
    }

    onOptionClick(target) {
        this.selectOption(target);
        this.hideMenu();
    }

    selectActiveOption() {
        const activeOption = this.getActiveOption();
        this.selectOption(activeOption);
        this.hideMenu();
    }

    selectOption(optionElement) {
        const optionValue = optionElement.getAttribute('data-option-value');
        this.setValue(optionValue);
        this.hideMenu();
        this.focusTextBox();
    }

    onTextBoxDownPressed(e) {
        const valueText = e.target.value.trim();
        if (valueText.length === 0 || this.isExactMatch(valueText)) {
            const options = this.getAllOptions();
            this.buildMenu(options);
            this.showMenu();
            const firstOption = this.getFirstOption();
            this.highlightOption(firstOption);
        } else {
            const options = this.getOptions(valueText);
            if (options.length > 0) {
                this.buildMenu(options);
                this.showMenu();
                const firstOption = this.getFirstOption();
                this.highlightOption(firstOption);
            }
        }
    }

    onOptionDownArrow(e) {
        const nextOption = this.getNextOption();
        if (nextOption) {
            this.highlightOption(nextOption);
            e.preventDefault();
        }
    }

    onOptionUpArrow(t) {
        if (this.isOptionSelected()) {
            const option = this.getPreviousOption();
            if (option) {
                this.highlightOption(option);
            } else {
                this.focusTextBox();
                this.hideMenu();
            }
            t.preventDefault();
        }
    }

    isOptionSelected() {
        return this.activeOptionId;
    }

    getActiveOption() {
        return this.container.querySelector(`#${this.activeOptionId}`);
    }

    getFirstOption() {
        return this.menu.querySelector('li');
    }

    getPreviousOption() {
        return this.container.querySelector(`#${this.activeOptionId}`).previousElementSibling;
    }

    getNextOption() {
        return this.container.querySelector(`#${this.activeOptionId}`).nextElementSibling;
    }

    highlightOption(element) {
        if (this.activeOptionId) {
            this.getOptionById(this.activeOptionId).setAttribute('aria-selected', 'false');
        }
        element.setAttribute('aria-selected', 'true');

        this.activeOptionId = element.id;
        element.focus();
    }

    getOptionById(id) {
        return this.container.querySelector(`#${id}`);
    }

    showMenu() {
        this.menu.classList.remove('visually-hidden');
        this.textBox.setAttribute('aria-expanded', 'true');
    }

    hideMenu() {
        this.menu.classList.add('visually-hidden');
        this.textBox.setAttribute('aria-expanded', 'false');
        this.activeOptionId = null;
        this.clearOptions();
    }

    clearOptions() {
        this.menu.innerHTML = '';
    }

    getOptions(textValue) {
        const tValue = textValue.toLowerCase();
        const e = [];

        function findOptions(i) {
            const alternativeName = i.getAttribute('data-alt-name');
            const value = i.value.trim();

            const text = i.textContent.toLowerCase();

            if (
                (value.length > 0 && text.includes(tValue)) ||
                (alternativeName && alternativeName.toLowerCase().includes(tValue))
            ) {
                e.push({
                    text: i.textContent,
                    value: i.value.trim()
                });
            }
        }

        this.selectElement.querySelectorAll('option').forEach(findOptions);

        return e;
    }

    getAllOptions() {
        const e = [];

        function pushOptionDetails(item) {
            if (item.value.trim().length > 0) {
                e.push({
                    text: item.textContent,
                    value: item.getAttribute('value')
                });
            }
        }

        this.selectElement.querySelectorAll('option').forEach(pushOptionDetails);

        return e;
    }

    isExactMatch(valueText) {
        return this.getMatchingOption(valueText);
    }

    getMatchingOption(valueText) {
        let e = null;

        function findItem(item) {
            if (item.textContent.toLowerCase() === valueText.toLowerCase()) {
                e = item;
            }
        }

        this.selectElement.querySelectorAll('options').forEach(findItem);

        return e;
    }

    buildMenu(options) {
        this.clearOptions();
        this.activeOptionId = null;

        if (options.length) {
            for (let i = 0; i < options.length; i += 1) {
                this.menu.appendChild(this.getOptionHtml(i, options[i]));
            }
        } else {
            this.menu.appendChild(this.getNoResultsOptionHtml());
        }
        this.menu.scrollTop = 0;
    }

    getNoResultsOptionHtml() {
        const node = document.createElement('li');
        node.classList.add('autocomplete-optionNoResults');
        node.textContent = 'No results';
        return node;
    }

    getOptionHtml(index, option) {
        const node = this.template.content.cloneNode(true).querySelector('li');
        node.setAttribute('data-option-value', `${option.value}`);
        node.id = `autocomplete-option-${index}`;
        node.textContent = `${option.text}`;

        // const node = template.content.firstElementChild;
        return node;
    }

    createStatusBox() {
        const element = document.createElement('div');
        element.setAttribute('aria-live', 'polite');
        element.setAttribute('role', 'status');
        element.classList.add('visually-hidden');

        this.status = element;
        this.wrapper.appendChild(element);
    }

    updateStatus(optionsLength) {
        if (optionsLength === 0) {
            this.status.textContent = 'No results.';
        } else {
            this.status.textContent = `${optionsLength} results available.`;
        }
    }

    hideSelectBox() {
        this.selectElement.setAttribute('aria-hidden', 'true');
        this.selectElement.setAttribute('tabindex', '-1');
        this.selectElement.classList.add('visually-hidden');
        this.selectElement.id = '';
    }

    getOptionsId() {
        return `autocomplete-options-${this.selectElement.id}`;
    }

    createMenu() {
        const self = this;

        const element = document.createElement('ul');
        element.id = this.getOptionsId();
        element.setAttribute('role', 'listbox');
        element.classList.add('visually-hidden');

        this.menu = element;
        this.wrapper.append(this.menu);

        function handleClick(e) {
            if (e.target.getAttribute('role') === 'option') {
                self.onOptionClick(e.target);
            }
        }

        this.menu.addEventListener('click', handleClick);
        this.menu.addEventListener('keydown', this.onMenuKeyDown.bind(this));
    }

    getOption(optionValue) {
        return this.selectElement.querySelector(`option[value="${optionValue}"]`);
    }

    setValue(optionValue) {
        this.selectElement.value = optionValue;
        const e = this.getOption(optionValue).textContent;
        if (optionValue.trim().length > 0) {
            this.textBox.value = e;
        } else {
            this.textBox.value = '';
        }
    }
}

window.customElements.define('autocomplete-dropdown', AutoCompleteDropdown);