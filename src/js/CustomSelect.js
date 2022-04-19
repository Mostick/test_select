class CustomSelect {
    #CLASS_OPEN = 'open';

    #nativeWrapperElement;
    #nativeSelectElement;
    #nativeOptionElements;
    #customSelectElement;
    #customValueElement;
    #customOptionElements;
    #value;
    #isOpen = false;
    #options;
    #onChangeCallbacks = [];

    constructor(selector, options){
        this.#options = options || {};
        this.#nativeWrapperElement = document.querySelector(selector);
        this.#nativeSelectElement = this.#nativeWrapperElement?.querySelector('select');

        if(!this.#nativeSelectElement) return console.error(`Error! No element by '${selector}' selector!`);

        this.#nativeOptionElements = [...this.#nativeSelectElement.querySelectorAll('option')].reverse();

        this.#initCustomSelect();
    }

    static generateCustomSelectElement = (currentValue, nativeOptionElements, options) => {
        function getClassNamesAsString (arrClassName){
            return arrClassName.join(" ").trim();
        }

        const template = `
            <div class="${getClassNamesAsString(["custom-select", options.main])}">
                <div class="custom-select__value">
                    <div class="custom-select__value-text">${currentValue}</div>
                    <img class="custom-select__value-img" src="./src/svg/arrow.svg" alt="arrow-icon">
                </div>
                <div class="custom-select__options"></div>
            </div>
        `;

        const div = document.createElement('div');

        div.insertAdjacentHTML('afterbegin', template);

        const optionsContainer = div.querySelector('.custom-select__options');

        nativeOptionElements.forEach(nativeOption => {
            optionsContainer.insertAdjacentHTML(
                'afterbegin',
                `<div class="${getClassNamesAsString(["custom-select__options-item", options.optionItem])}" data-value="${nativeOption.value}">
                    ${nativeOption.innerText}
                </div>`
            )
        });

        return div.firstElementChild;
    };

    #triggerCallbacks(){
        this.#onChangeCallbacks.forEach(callback => {
            callback(this.#value);
        });
    }

    #hideOptions(){
        this.#customSelectElement.classList.remove(this.#CLASS_OPEN);
        this.#isOpen = false;
    }

    #showOptions(){
        this.#customSelectElement.classList.add(this.#CLASS_OPEN);
        this.#isOpen = true;
    }

    #setValue(value){
        const nativeOptionByValue = this.#nativeOptionElements.find(option => option.value === value);
        const textOfValue = nativeOptionByValue.innerText;

        if(!textOfValue) return console.warn("No provided value in the current select!");

        this.#customValueElement.innerText = textOfValue;
        this.#value = value;
    }

    #onOptionSelected(customOption){
        this.#setValue(customOption.dataset.value);

        this.#hideOptions();
        this.#triggerCallbacks();
    }

    #addEventListeners(){
        this.#customSelectElement.addEventListener('click', e => {
            e.stopPropagation();

            if(this.#isOpen) this.#hideOptions();
            else this.#showOptions();
        });

        this.#customOptionElements.forEach(option => {
            option.addEventListener('click', e => {
                e.stopPropagation();

                this.#onOptionSelected(option);
            });
        });

        window.addEventListener('click', e => {
            if(this.#isOpen) this.#hideOptions();
        });
    }

    #hideNativeSelect(){
        this.#nativeSelectElement.style.display = 'none';
    }

    #initCustomSelect(){
        this.#value = this.#nativeSelectElement.value;
        this.#customSelectElement = CustomSelect.generateCustomSelectElement(this.#value, this.#nativeOptionElements, this.#options);
        this.#customValueElement = this.#customSelectElement.querySelector('.custom-select__value-text');
        this.#customOptionElements = this.#customSelectElement.querySelectorAll('.custom-select__options-item');
        this.#nativeSelectElement.insertAdjacentElement('afterend', this.#customSelectElement);

        this.#hideNativeSelect();
        this.#addEventListeners();
    }

    getValue(){
        return this.#value;
    }

    setValue(value, isTriggerCallbacks){
        this.#setValue(value);

        if(isTriggerCallbacks) this.#triggerCallbacks();
    }

    onChange(callback){
        this.#onChangeCallbacks.push(callback);
    }
}
