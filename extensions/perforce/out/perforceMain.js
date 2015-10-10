'use strict';
define(["require", "exports", 'vscode'], function (require, exports, vscode) {
    var isWin = /^win/.test(process.platform);
    var _channel = vscode.window.getOutputChannel('Perforce Log');
    var CP = require('child_process');
    
    function activate(subscriptions) {
        _channel.appendLine("Perforce Log Output");
        
        var disposables = [];
                
        disposables.push( registerCommands() );
        
        return vscode.Disposable.of.apply(vscode.Disposable, disposables);
    }
    
    exports.activate = activate;
    
    function registerCommands() {
        var d0 = vscode.commands.registerCommand('perforce.showOutput', p_showOutput);
        var d1 = vscode.commands.registerCommand('perforce.edit', p_edit);
        var d2 = vscode.commands.registerCommand('perforce.revert', p_revert);
        
        return vscode.Disposable.of(d0, d1, d2);
    }
    
    function p_showOutput() {
        _channel.reveal();
    }
    
    function p_edit() {
        var command = "p4";
        if (isWin) {
            command += ".exe";
        }
        
        command += " edit ";
        var editor = vscode.window.getActiveTextEditor();
        if (!editor) {
            vscode.window.showInformationMessage("Perforce: no file selected");
            return ;
        }
        var uri = editor.getTextDocument().getUri();
        command += uri.fsPath;
        
        _channel.appendLine(command);
        CP.exec(command, function (err, stdout, stderr) {
            if (err) {
                _channel.reveal();
                _channel.appendLine("ERROR:");
                _channel.append(stderr.toString());
            }
            else {
                vscode.window.showInformationMessage("Perforce: file opened for edit");
                _channel.append(stdout.toString());
            }
        });
    }
    function p_revert() {
        var command = "p4";
        if (isWin) {
            command += ".exe";
        }
        
        command += " revert ";
        var editor = vscode.window.getActiveTextEditor();
        if (!editor) {
            vscode.window.showInformationMessage("Perforce: no file selected");
            return ;
        }
        var uri = editor.getTextDocument().getUri();
        command += uri.fsPath;
        
        _channel.appendLine(command);
        CP.exec(command, function (err, stdout, stderr) {
            if (err) {
                _channel.reveal();
                _channel.appendLine("ERROR:");
                _channel.append(stderr.toString());
            }
            else {
                vscode.window.showInformationMessage("Perforce: file reverted");
                _channel.append(stdout.toString());
            }
        });
    }
});
//# sourceMappingURL=perforceMain.js.map