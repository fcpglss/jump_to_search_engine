import {App, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        console.log('loading plugin');

        await this.loadSettings();

        this.addRibbonIcon('dice', 'Sample Plugin', () => {
            new Notice('This is a notice!');
        });

        this.addStatusBarItem().setText('Status Bar Text');

        this.addCommand({
            id: 'open-sample-modal',
            name: 'Open Sample Modal',
            // callback: () => {
            // 	console.log('Simple Callback');
            // },
            checkCallback: (checking: boolean) => {
                let leaf = this.app.workspace.activeLeaf;
                if (leaf) {
                    if (!checking) {
                        new SampleModal(this.app).open();
                    }
                    return true;
                }
                return false;
            }
        });

        this.addSettingTab(new SampleSettingTab(this.app, this));

        this.registerCodeMirror((cm: CodeMirror.Editor) => {
            console.log('codemirror', cm);
        });

        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            // console.log('click', evt);
        });


        function search(engineName) {
            let se_input = document.querySelector('body > div.app-container.is-left-sidedock-collapsed.is-right-sidedock-collapsed > div.horizontal-main-container > div > div.workspace-split.mod-horizontal.mod-left-split > div.workspace-tabs > div.workspace-leaf > div > div.search-input-container > input[type=text]')
            let se_link = ''
            if (engineName === 'baidu') {
                se_link = "https://www.baidu.com/s?ie=UTF-8&wd=" + se_input.value

            }
            if (engineName === 'google') {
                se_link = "https://www.google.com/search?q=" + se_input.value
            }
            window.open(se_link);
        }

        function appendDiv(parentNode,engineName,displayName){
            let d = document.createElement("div")
            d.setAttribute("style", "display:inline-block;")
            d.innerHTML = displayName
            d.addEventListener('click', function (event) {
                search(engineName)
            })
            parentNode.appendChild(d)
        }


        setTimeout(function () {
            // let sic = document.querySelector(".search-input-container")
            //
            // appendDiv(sic,'google','谷歌')
            // appendDiv(sic,'baidu','百度')

            function hotkey() {
                var a = window.event.keyCode;
                console.log('key down ',a)
                //q
                if ((a == 81) && (event.altKey)) {
                   search('google')
                }
                //w
                if ((a == 87) && (event.altKey)) {
                    search('baidu')
                }
            }// end hotkey
            document.onkeydown = hotkey;

        }, 1000)


        // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload() {
        console.log('unloading plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    onOpen() {
        let {contentEl} = this;
        contentEl.setText('Woah!');
    }

    onClose() {
        let {contentEl} = this;
        contentEl.empty();
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue('')
                .onChange(async (value) => {
                    console.log('Secret: ' + value);
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
