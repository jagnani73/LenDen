import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:unfold/file_exporter.dart';

import 'package:web3modal_flutter/web3modal_flutter.dart';

import 'package:unfold/models/chain_metadata.dart';
import 'package:unfold/utils/constants.dart';
import 'package:unfold/utils/crypto/eip155.dart';
import 'package:unfold/utils/crypto/helpers.dart';
import 'package:unfold/utils/string_constants.dart';
import 'package:unfold/widgets/method_dialog.dart';

class SessionWidget extends StatefulWidget {
  const SessionWidget({
    super.key,
    required this.session,
    required this.web3App,
    required this.launchRedirect,
  });

  final SessionData session;
  final IWeb3App web3App;
  final void Function() launchRedirect;

  @override
  SessionWidgetState createState() => SessionWidgetState();
}

class SessionWidgetState extends State<SessionWidget> {
  @override
  Widget build(BuildContext context) {
    final List<Widget> children = [];

    // Get all of the accounts
    final List<String> namespaceAccounts = [];

    // Loop through the namespaces, and get the accounts
    for (final Namespace namespace in widget.session.namespaces.values) {
      namespaceAccounts.addAll(namespace.accounts);
    }

    // Loop through the namespace accounts and build the widgets
    for (final String namespaceAccount in namespaceAccounts) {
      children.add(_buildAccountWidget(namespaceAccount));
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildAccountWidget(String namespaceAccount) {
    final String chainId = NamespaceUtils.getChainFromAccount(
      namespaceAccount,
    );
    final String account = NamespaceUtils.getAccount(
      namespaceAccount,
    );

    final ChainMetadata chainMetadata = getChainMetadataFromChain(chainId);
    WalletConstants.setAddressAndChainId(
        account, chainMetadata.w3mChainInfo.chainName);
    log(WalletConstants.chainIds.toString());
    log(WalletConstants.walletAddresses.toString());
    final List<Widget> children = [
      const SizedBox(height: StyleConstants.linear8),
      Text(account, textAlign: TextAlign.center),
      const SizedBox(height: StyleConstants.linear8),
    ];

    children.addAll(_buildChainMethodButtons(chainMetadata, account));

    return Container(
      padding: const EdgeInsets.all(StyleConstants.linear8),
      margin: const EdgeInsets.symmetric(vertical: StyleConstants.linear8),
      decoration: BoxDecoration(
        border: Border.all(color: chainMetadata.color),
        borderRadius: const BorderRadius.all(
          Radius.circular(StyleConstants.linear8),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: children,
      ),
    );
  }

  List<Widget> _buildChainMethodButtons(
    ChainMetadata chainMetadata,
    String address,
  ) {
    final List<Widget> buttons = [];
    // Add Methods
    for (final String method in getChainMethods(chainMetadata.type)) {
      buttons.add(
        Container(
          height: StyleConstants.linear40,
          width: double.infinity,
          margin: const EdgeInsets.symmetric(vertical: StyleConstants.linear8),
          child: ElevatedButton(
            onPressed: () async {
              final future = callChainMethod(
                chainMetadata.type,
                method,
                chainMetadata,
                address,
              );
              MethodHandler.handle(context, method, future);
              widget.launchRedirect();
            },
            style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all<Color>(
                chainMetadata.color,
              ),
              shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(
                    StyleConstants.linear8,
                  ),
                ),
              ),
            ),
            child: Text(
              "Generate Signature",
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      );
    }

    return buttons;
  }

  Future<dynamic> callChainMethod(
    ChainType type,
    String method,
    ChainMetadata chainMetadata,
    String address,
  ) {
    switch (type) {
      case ChainType.eip155:
        return EIP155.callMethod(
          web3App: widget.web3App,
          topic: widget.session.topic,
          method: method.toEip155Method()!,
          chainId: chainMetadata.w3mChainInfo.namespace,
          address: address.toLowerCase(),
        );
      // case ChainType.kadena:
      //   return Kadena.callMethod(
      //     web3App: widget.web3App,
      //     topic: widget.session.topic,
      //     method: method.toKadenaMethod()!,
      //     chainId: chainMetadata.chainId,
      //     address: address.toLowerCase(),
      //   );
      default:
        return Future<dynamic>.value();
    }
  }
}
