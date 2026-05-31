import { Plugin } from "obsidian";
import { SproutSettings, DEFAULT_SETTINGS, SproutSettingTab } from "./settings";
import { explainSelection } from "./explainSelection";

export default class SproutPlugin extends Plugin {
    settings!: SproutSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SproutSettingTab(this.app, this));

        this.registerEvent(
            this.app.workspace.on("editor-menu", (menu, editor) => {
                if (!editor.getSelection()) return;
                menu.addItem((item) =>
                    item.setTitle("Explain selection")
                        .setIcon("sprout")
                        .onClick(() => explainSelection(this, editor))
                );
            })
        );

        this.addCommand({
            id: "explain-selection",
            name: "Explain selection",
            icon: "sprout",
            editorCheckCallback: (checking, editor) => {
                if (!editor.getSelection()) return false;
                if (!checking) void explainSelection(this, editor);
                return true;
            },
        });
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) as SproutSettings;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
