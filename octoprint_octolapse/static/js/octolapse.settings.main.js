/*
    This file is subject to the terms and conditions defined in
    a file called 'LICENSE', which is part of this source code package.
*/
$(function () {

    Octolapse.MainSettingsViewModel = function (parameters) {
        // Create a reference to this object
        var self = this;

        // Add this object to our Octolapse namespace
        Octolapse.SettingsMain = this;
        // Assign the Octoprint settings to our namespace
        self.global_settings = parameters[0];

        // Settings values
        self.is_octolapse_enabled = ko.observable();
        self.auto_reload_latest_snapshot = ko.observable();
        self.auto_reload_frames = ko.observable();
        self.show_navbar_icon = ko.observable();
        self.show_navbar_when_not_printing = ko.observable();
        
        self.show_position_state_changes = ko.observable();
        self.show_position_changes = ko.observable();
        self.show_extruder_state_changes = ko.observable();
        self.show_trigger_state_changes = ko.observable();


        // Informational Values
        self.platform = ko.observable();


        self.onBeforeBinding = function () {

        };
        // Get the dialog element
        self.onAfterBinding = function () {
            settings = self.global_settings.settings.plugins.octolapse;
            self.is_octolapse_enabled(settings.is_octolapse_enabled());
            self.auto_reload_latest_snapshot(settings.auto_reload_latest_snapshot());
            self.auto_reload_frames(settings.auto_reload_frames());
            self.show_navbar_icon(settings.show_navbar_icon());
            self.show_navbar_when_not_printing(settings.show_navbar_when_not_printing());
            
            self.show_position_state_changes(settings.show_position_state_changes());
            self.show_position_changes(settings.show_position_changes());
            self.show_extruder_state_changes(settings.show_extruder_state_changes());
            self.show_trigger_state_changes(settings.show_trigger_state_changes());
            self.platform(settings.platform());

            
        };
        /*
            Show and hide the settings tabs based on the enabled parameter
        */
        self.setSettingsVisibility = function (isVisible) {
            if (isVisible) {
                //console.log("Showing Settings")
            }

            else {
                //console.log("Hiding settings")
                $('#octolapse_settings div.tab-content .hide-disabled').each(function (index, element) {
                    // Clear any active tabs
                    $(element).removeClass('active');
                });
            }
            $('#octolapse_settings ul.nav .hide-disabled').each(function (index, element) {
                if (isVisible)
                    $(element).show();
                else
                    $(element).hide();
                $(element).removeClass('active');
            });

        };

        self.update = function (settings) {
            self.is_octolapse_enabled(settings.is_octolapse_enabled);
            self.auto_reload_latest_snapshot(settings.auto_reload_latest_snapshot);
            self.auto_reload_frames(settings.auto_reload_frames);
            self.show_navbar_icon(settings.show_navbar_icon);
            self.show_navbar_when_not_printing(settings.show_navbar_when_not_printing);
            self.show_position_state_changes(settings.show_position_state_changes);
            self.show_position_changes(settings.show_position_changes);
            self.show_extruder_state_changes(settings.show_extruder_state_changes);
            self.show_trigger_state_changes(settings.show_trigger_state_changes);

            // Set the tab-button/tab visibility
            self.setSettingsVisibility(settings.is_octolapse_enabled);
        };

        self.showEditMainSettingsPopup = function () {
            //console.log("showing main settings")
            self.is_octolapse_enabled(Octolapse.Globals.enabled());
            self.auto_reload_latest_snapshot(Octolapse.Globals.auto_reload_latest_snapshot());
            self.auto_reload_frames(Octolapse.Globals.auto_reload_frames());
            self.show_navbar_icon(Octolapse.Globals.navbar_enabled());
            self.show_navbar_when_not_printing(Octolapse.Globals.show_navbar_when_not_printing());
            self.show_position_state_changes(Octolapse.Globals.show_position_state_changes());
            self.show_position_changes(Octolapse.Globals.show_position_changes());
            self.show_extruder_state_changes(Octolapse.Globals.show_extruder_state_changes());
            self.show_trigger_state_changes(Octolapse.Globals.show_trigger_state_changes());

            dialog = this;
            dialog.$editDialog = $("#octolapse_edit_settings_main_dialog");
            dialog.$editForm = $("#octolapse_edit_main_settings_form");
            dialog.$cancelButton = $("a.cancel", dialog.$addEditDialog);
            dialog.$saveButton = $("a.save", dialog.$addEditDialog);
            dialog.$defaultButton = $("a.set-defaults", dialog.$addEditDialog);
            dialog.$summary = dialog.$editForm.find("#edit_validation_summary");
            dialog.$errorCount = dialog.$summary.find(".error-count");
            dialog.$errorList = dialog.$summary.find("ul.error-list");
            dialog.$modalBody = dialog.$editDialog.find(".modal-body");
            dialog.rules = {
                rules: Octolapse.MainSettingsValidationRules.rules,
                messages: Octolapse.MainSettingsValidationRules.messages,
                ignore: ".ignore_hidden_errors:hidden",
                errorPlacement: function (error, element) {
                    var $field_error = $(element).parent().parent().find(".error_label_container");
                    $field_error.html(error);
                    $field_error.removeClass("checked");

                },
                highlight: function (element, errorClass) {
                    //$(element).parent().parent().addClass(errorClass);
                    var $field_error = $(element).parent().parent().find(".error_label_container");
                    $field_error.removeClass("checked");
                    $field_error.addClass(errorClass);
                },
                unhighlight: function (element, errorClass) {
                    //$(element).parent().parent().removeClass(errorClass);
                    var $field_error = $(element).parent().parent().find(".error_label_container");
                    $field_error.addClass("checked");
                    $field_error.removeClass(errorClass);
                },
                invalidHandler: function () {
                    dialog.$errorCount.empty();
                    dialog.$summary.show();
                    numErrors = dialog.validator.numberOfInvalids();
                    if (numErrors == 1)
                        dialog.$errorCount.text("1 field is invalid");
                    else
                        dialog.$errorCount.text(numErrors + " fields are invalid");
                },
                errorContainer: "#edit_validation_summary",
                success: function (label) {
                    label.html("&nbsp;");
                    label.parent().addClass('checked');
                    $(label).parent().parent().parent().removeClass('error');
                },
                onfocusout: function (element, event) {
                    dialog.validator.form();
                }
            };
            dialog.validator = null;
            //console.log("Adding validator to main setting dialog.")
            dialog.$editDialog.on("hidden.bs.modal", function () {
                // Clear out error summary
                dialog.$errorCount.empty();
                dialog.$errorList.empty();
                dialog.$summary.hide();
                // Destroy the validator if it exists, both to save on resources, and to clear out any leftover junk.
                if (dialog.validator != null) {
                    dialog.validator.destroy();
                    dialog.validator = null;
                }
            });
            dialog.$editDialog.on("shown.bs.modal", function () {
                // Create all of the validation rules
                
                dialog.validator = dialog.$editForm.validate(dialog.rules);

                // Remove any click event bindings from the cancel button
                dialog.$cancelButton.unbind("click");
                // Called when the user clicks the cancel button in any add/update dialog
                dialog.$cancelButton.bind("click", function () {
                    // Hide the dialog
                    self.$editDialog.modal("hide");
                });

                // remove any click event bindings from the defaults button
                dialog.$defaultButton.unbind("click");
                dialog.$defaultButton.bind("click", function () {
                    // Set the options to the current settings
                    self.is_octolapse_enabled(true);
                    self.auto_reload_latest_snapshot(true);
                    self.auto_reload_frames(5);
                    self.show_navbar_icon(true);
                    self.show_navbar_when_not_printing(false);
                    self.show_position_state_changes(false);
                    self.show_position_changes(false);
                    self.show_extruder_state_changes(false);
                    self.show_trigger_state_changes(false);

                });

                // Remove any click event bindings from the save button
                dialog.$saveButton.unbind("click");
                // Called when a user clicks the save button on any add/update dialog.
                dialog.$saveButton.bind("click", function ()
                {
                    if (dialog.$editForm.valid()) {
                        // the form is valid, add or update the profile
                        var data = {
                            "is_octolapse_enabled": self.is_octolapse_enabled()
                            , "auto_reload_latest_snapshot": self.auto_reload_latest_snapshot()
                            , "auto_reload_frames": self.auto_reload_frames()
                            , "show_navbar_icon": self.show_navbar_icon()
                            , "show_navbar_when_not_printing": self.show_navbar_when_not_printing()
                            , "show_position_state_changes": self.show_position_state_changes()
                            , "show_position_changes": self.show_position_changes()
                            , "show_extruder_state_changes": self.show_extruder_state_changes()
                            , "show_trigger_state_changes": self.show_trigger_state_changes()
                            , "client_id": Octolapse.Globals.client_id
                        };
                        //console.log("Saving main settings.")
                        $.ajax({
                            url: "/plugin/octolapse/saveMainSettings",
                            type: "POST",
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            dataType: "json",
                            success: function (settings) {
                                self.$editDialog.modal("hide");
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                alert("Unable to save the main settings.  Status: " + textStatus + ".  Error: " + errorThrown);
                            }
                        });
                    }
                    else
                    {
                        // Search for any hidden elements that are invalid
                        //console.log("Checking ofr hidden field error");
                        $fieldErrors = dialog.$editForm.find('.error_label_container.error');
                        $fieldErrors.each(function (index, element) {
                            // Check to make sure the field is hidden.  If it's not, don't bother showing the parent container.
                            // This can happen if more than one field is invalid in a hidden form
                            $errorContainer = $(element);
                            if (!$errorContainer.is(":visible")) {
                                //console.log("Hidden error found, showing");
                                $collapsableContainer = $errorContainer.parents(".collapsible");
                                if ($collapsableContainer.length > 0)
                                    // The containers may be nested, show each
                                    $collapsableContainer.each(function (index, container) {
                                        //console.log("Showing the collapsed container");
                                        $(container).show();
                                    });
                            }

                        });

                        // The form is invalid, add a shake animation to inform the user
                        $(dialog.$editDialog).addClass('shake');
                        // set a timeout so the dialog stops shaking
                        setTimeout(function () { $(dialog.$editDialog).removeClass('shake'); }, 500);
                    }

                });
            });
                
            

            dialog.$editDialog.modal();
        };
        
        Octolapse.MainSettingsValidationRules = {
            rules: {

            },
            messages: {

            }
        };
    };
    // Bind the settings view model to the plugin settings element
    OCTOPRINT_VIEWMODELS.push([
        Octolapse.MainSettingsViewModel
        , ["settingsViewModel"]
        , ["#octolapse_main_tab"]
    ]);
});

